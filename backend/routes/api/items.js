const express = require('express');
const { check } = require('express-validator');
const { Op, where } = require('sequelize');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Character, CustomizationItem, CharacterCustomization } = require('../../db/models');

const router = express.Router();

// Get all items available for purchase
router.get('/', requireAuth, async (req, res) => {
    const items = await CustomizationItem.findAll({
        attributes: ['type', 'description', 'color', 'levelRequirement', 'price', 'available']
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
        attributes: ['type', 'description', 'color', 'levelRequirement', 'price', 'available']
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

module.exports = router;
