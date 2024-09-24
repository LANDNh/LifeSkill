const express = require('express');
const { check } = require('express-validator');
const { Op } = require('sequelize');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Character, CustomizationItem, CharacterCustomization } = require('../../db/models');

const router = express.Router();

// Get all items available for purchase
router.get('/', requireAuth, async (req, res) => {
    const items = await CustomizationItem.findAll({
        attributes: ['id', 'type', 'description', 'levelRequirement', 'price', 'available', 'url']
    });

    const itemObj = {};
    const itemList = [];

    items.forEach(item => {
        itemList.push(item.toJSON());
    });

    itemObj.Items = itemList;

    return res.json(itemObj);
});

// Get details of item specified by id
router.get('/:itemId', requireAuth, async (req, res) => {
    const { itemId } = req.params;
    const item = await CustomizationItem.findOne({
        where: {
            id: itemId
        },
        attributes: ['id', 'type', 'description', 'levelRequirement', 'price', 'available', 'url']
    });

    if (!item) {
        return res.status(404).json({
            message: 'Item could not be found'
        });
    }

    const itemObj = {
        ...item.dataValues
    };

    return res.json(itemObj);
});

// Buy an item from the item shop
router.post('/:itemId', requireAuth, async (req, res) => {
    const { user } = req;
    const { itemId } = req.params;
    const userChar = await Character.findOne({
        where: {
            userId: user.id
        },
        attributes: ['id', 'level', 'totalCoins'],
        include: [
            {
                model: CharacterCustomization,
                attributes: ['id', 'characterId', 'itemId', 'equipped'],
                include: [
                    {
                        model: CustomizationItem,
                        attributes: ['type', 'description', 'levelRequirement']
                    }
                ]
            }
        ]
    });

    const item = await CustomizationItem.findOne({
        where: {
            id: itemId
        },
        attributes: ['id', 'type', 'description', 'levelRequirement', 'price', 'available']
    });

    if (!userChar) {
        return res.status(404).json({
            message: 'Character could not be found'
        })
    }

    if (!item) {
        return res.status(404).json({
            message: 'Item could not be found'
        });
    }

    // Check user level against item's required level
    if (userChar.level < item.levelRequirement) {
        return res.status(400).json({
            message: 'Character level is too low for this item'
        });
    }

    // Check item availability
    if (item.available !== null && item.available === false) {
        return res.status(400).json({
            message: 'Item is not available'
        });
    }

    // Make sure character has enough coins
    if (userChar.totalCoins - item.price < 0) {
        return res.status(400).json({
            message: 'Character does not have enough coins for this item'
        });
    } else {
        userChar.set({
            totalCoins: userChar.totalCoins - item.price
        });

        const charItemData = {
            characterId: userChar.id,
            itemId: item.id
        }

        if (item.available !== null && item.available === true) {
            item.available = !item.available;
        }

        const newItem = await CharacterCustomization.create(charItemData);

        await userChar.save();
        await item.save();

        return res.json(newItem);
    }
});

// Sell an item for about half coins back
router.delete('/:itemId', requireAuth, async (req, res) => {
    const { user } = req;
    const { itemId } = req.params;
    const userChar = await Character.findOne({
        where: {
            userId: user.id
        },
        attributes: ['level', 'totalCoins'],
        include: [
            {
                model: CharacterCustomization,
                attributes: ['id', 'characterId', 'itemId', 'equipped'],
                include: [
                    {
                        model: CustomizationItem,
                        attributes: ['type', 'description', 'levelRequirement', 'available']
                    }
                ]
            }
        ]
    });

    const item = await CustomizationItem.findOne({
        where: {
            id: itemId
        },
        attributes: ['id', 'type', 'description', 'levelRequirement', 'price', 'available']
    });

    if (!userChar) {
        return res.status(404).json({
            message: 'Character could not be found'
        })
    }

    if (!item) {
        return res.status(404).json({
            message: 'Item could not be found'
        });
    }

    try {
        const price = item.price;

        await CharacterCustomization.destroy({
            where: {
                characterId: userChar.id,
                itemId: item.id
            }
        });

        if (item.available !== null && item.available === false) {
            item.available = !item.available;
        }

        userChar.set({
            totalCoins: userChar.totalCoins += Math.floor(price / 2)
        });
    } catch (e) {
        return res.json({
            message: e.message
        });
    }
});

module.exports = router;
