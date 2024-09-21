const express = require('express');
const { check } = require('express-validator');
const { Op } = require('sequelize');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Friend, Character, CustomizationItem, CharacterCustomization, RetainedAttribute } = require('../../db/models');

const router = express.Router();

const validateCharacter = [
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Character name is required'),
    check('skin')
        .exists({ checkFalsy: true })
        .withMessage('Skin color is required'),
    check('eyes')
        .exists({ checkFalsy: true })
        .withMessage('Eye color is required'),
    check('status')
        .custom(async val => {
            if (val && (val.length < 20 || val.length > 200)) {
                throw new Error('Status must be between 20 and 200 characters')
            }
        }),
    handleValidationErrors
]

// Get all user characters besides current user besides friends/requests
router.get('/', requireAuth, async (req, res) => {
    const { user } = req;

    // Find all friends relationships
    const friends = await Friend.findAll({
        where: {
            [Op.or]: [
                { addresserId: user.id },
                { addresseeId: user.id }
            ]
        },
        attributes: ['addresserId', 'addresseeId']
    });

    // Extract friend IDs
    const friendIds = friends.map(friend => {
        return friend.addresserId === user.id ? friend.addresseeId : friend.addresserId;
    });

    // Get characters of users with no friend relationships
    const characters = await Character.findAll({
        where: {
            userId: {
                [Op.ne]: user.id,
                [Op.notIn]: friendIds
            }
        },
        attributes: ['id', 'userId', 'name', 'status', 'level', 'skin', 'eyes']
    });
    const charObj = {};
    const charList = [];

    characters.forEach(character => {
        charList.push(character.toJSON());
    });

    charObj.Characters = charList;

    return res.json(charObj);
});

// Get current user character
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const character = await Character.findOne({
        where: {
            userId: user.id
        },
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

    if (!character) {
        return res.status(404).json({
            message: 'Character could not be found'
        });
    } else {
        const charObj = {
            id: character.id,
            userId: character.userId,
            name: character.name,
            skin: character.skin,
            eyes: character.eyes,
            status: character.status,
            level: character.level,
            totalXp: character.totalXp,
            totalCoins: character.totalCoins,
            CharacterCustomizations: character.CharacterCustomizations
        }

        return res.json(charObj)
    }
});

// Get character by id
router.get('/:characterId', requireAuth, async (req, res) => {
    const character = await Character.findByPk(req.params.characterId, {
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

    if (!character) {
        return res.status(404).json({
            message: 'Character could not be found'
        });
    } else {
        const charObj = {
            id: character.id,
            userId: character.userId,
            name: character.name,
            skin: character.skin,
            eyes: character.eyes,
            status: character.status,
            level: character.level,
            totalXp: character.totalXp,
            totalCoins: character.totalCoins,
            CharacterCustomizations: character.CharacterCustomizations
        }

        return res.json(charObj)
    }
});

// Create character for current user
router.post('/current', requireAuth, validateCharacter, async (req, res) => {
    const { user } = req;
    const { name, skin, eyes, status } = req.body;
    const retainedAttributes = await RetainedAttribute.findOne({
        where: {
            userId: user.id
        }
    });
    const oldCharacter = await Character.findOne({
        where: {
            userId: user.id
        }
    });

    if (oldCharacter) {
        return res.status(400).json({
            message: 'User already has a Character'
        });
    }

    let charData = {
        userId: user.id,
        name,
        skin,
        eyes,
        status
    }

    // If user previously deleted as character, certain attributes are retained for new character
    // Transfers any owned items to current character id as unequipped and creates new database entries
    if (retainedAttributes) {
        charData = {
            ...charData,
            level: retainedAttributes.level,
            totalXp: retainedAttributes.totalXp,
            totalCoins: retainedAttributes.totalCoins,
        }

        const newCharacter = await Character.create(charData);

        const retainedCustomizations = retainedAttributes.CharacterCustomizations.map(customization => {
            return {
                characterId: newCharacter.id,
                itemId: customization.itemId,
                equipped: false
            };
        });

        await CharacterCustomization.bulkCreate(retainedCustomizations);

        await retainedAttributes.destroy();

        return res.json(newCharacter);
    } else {
        const newCharacter = await Character.create(charData);

        return res.json(newCharacter);
    }
});

// Send a friend request to a different character
router.post('/:characterId', requireAuth, async (req, res) => {
    const { user } = req;
    const addresseeChar = await Character.findByPk(req.params.characterId);

    if (!addresseeChar) {
        return res.status(404).json({
            message: 'Character could not be found'
        });
    }

    const sentFriend = await Friend.findOne({
        where: {
            addresserId: user.id,
            addresseeId: addresseeChar.userId,
            status: {
                [Op.or]: ['accepted', 'pending']
            }
        }
    });
    const recievedFriend = await Friend.findOne({
        where: {
            addresserId: addresseeChar.userId,
            addresseeId: user.id,
            status: {
                [Op.or]: ['accepted', 'pending']
            }
        }
    });

    if (sentFriend || recievedFriend) {
        return res.status(400).json({
            message: 'Requested character is either already on friend list or has a request pending'
        });
    }

    const requestData = {
        addresserId: user.id,
        addresseeId: addresseeChar.userId,
        status: 'pending'
    };

    const newRequest = await Friend.create(requestData);

    const newReqChar = await Friend.findByPk(newRequest.id, {
        include: {
            model: User,
            as: 'Addressee',
            include: {
                model: Character,
                as: 'Character'
            }
        }
    });

    return res.json(newReqChar);
});

// Edit character for current user
router.put('/current', requireAuth, validateCharacter, async (req, res) => {
    const { user } = req;
    const { name, skin, eyes, status, customizations } = req.body;
    const character = await Character.findOne({
        where: {
            userId: user.id
        },
        include: [
            {
                model: CharacterCustomization,
                attributes: ['id', 'characterId', 'itemId', 'equipped'],
                include: [
                    {
                        model: CustomizationItem,
                        attributes: ['type', 'description', 'color', 'levelRequirement']
                    }
                ]
            }
        ]
    });

    if (!character) {
        return res.status(404).json({
            message: 'Character could not be found'
        });
    }

    character.set({
        name: name || character.name,
        skin: skin || character.skin,
        eyes: eyes || character.eyes,
        status: status || character.status,
    });

    if (customizations && Array.isArray(customizations)) {
        // Track what type needs updated
        const typesToUpdate = {};
        // id = CharacterCustomization.id, equip is desired equipped state, true or false
        customizations.forEach(({ id, equip }) => {
            const customization = character.CharacterCustomizations.find(c => c.id === id);
            if (customization) {
                if (equip) {
                    // Mark this type for updating
                    typesToUpdate[customization.CustomizationItem.type] = true;
                }
                customization.equipped = equip;
            }
        });

        // Unequip any other items of the same type
        character.CharacterCustomizations.forEach(c => {
            if (typesToUpdate[c.CustomizationItem.type]) {
                if (!customizations.find(custom => custom.id === c.id)) {
                    c.equipped = false;
                }
            }
        });
    }

    await character.save();

    await Promise.all(character.CharacterCustomizations.map(customization => customization.save()));

    return res.json(character);
});

// Delete current user character to make a new one with retained attributes
router.delete('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const character = await Character.findOne({
        where: {
            userId: user.id
        },
        include: [
            {
                model: CharacterCustomization,
                attributes: ['id', 'characterId', 'itemId', 'equipped'],
            }
        ]
    });

    if (!character) {
        return res.status(404).json({
            message: 'Character could not be found'
        });
    } else {
        // Store certain attributes and owned items with user id, remove join table entries linking character and items
        await RetainedAttribute.create({
            userId: character.userId,
            level: character.level,
            totalXp: character.totalXp,
            totalCoins: character.totalCoins,
            CharacterCustomizations: character.CharacterCustomizations
        });

        await CharacterCustomization.destroy({
            where: {
                characterId: character.id
            }
        });

        await character.destroy();
        return res.json({
            message: 'Successfully deleted'
        });
    }
});

module.exports = router;
