const express = require('express');
const { check } = require('express-validator');
const { Op, where } = require('sequelize');

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

// Get all user characters besides current user
router.get('/', requireAuth, async (req, res) => {
    const { user } = req;
    const characters = await Character.findAll({
        where: {
            userId: {
                [Op.ne]: user.id
            }
        },
        attributes: ['id', 'userId', 'name', 'status', 'level']
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

//Get all characters that are friends with current character
router.get('/friends', requireAuth, async (req, res) => {
    const { user } = req;

    // Get friends that current character has sent a request to
    const addressedFriends = await Friend.findAll({
        where: {
            addresserId: user.id,
            status: 'accepted'
        },
        include: [
            {
                model: User,
                as: 'Addressee',
                attributes: ['id'],
                include: [
                    {
                        model: Character,
                        attributes: ['id', 'name', 'status', 'level']
                    }
                ]
            }
        ]
    });

    // Get friends that sent request to current character
    const addressingFriends = await Friend.findAll({
        where: {
            addresseeId: user.id,
            status: 'accepted'
        },
        include: [
            {
                model: User,
                as: 'Addresser',
                attributes: ['id'],
                include: [
                    {
                        model: Character,
                        attributes: ['id', 'name', 'status', 'level']
                    }
                ]
            }
        ]
    });

    const friendObj = {};
    const friendList = [];

    addressedFriends.forEach(friend => {
        friend = friend.toJSON();
        const friendChar = friend.Addressee.Character;
        friendList.push(friendChar);
    });

    addressingFriends.forEach(friend => {
        friend = friend.toJSON();
        const friendChar = friend.Addresser.Character;
        friendList.push(friendChar);
    });

    friendObj.Friends = friendList;

    return res.json(friendObj);
});

// Get all friend requests for current character, both recieved and sent
router.get('/requests', requireAuth, async (req, res) => {
    const { user } = req;

    // Get requests that current character has sent
    const sentRequests = await Friend.findAll({
        where: {
            addresserId: user.id,
            status: 'pending'
        },
        include: [
            {
                model: User,
                as: 'Addressee',
                attributes: ['id'],
                include: [
                    {
                        model: Character,
                        attributes: ['id', 'name', 'status', 'level']
                    }
                ]
            }
        ]
    });

    // Get requests that have been sent to current character
    const recievedRequests = await Friend.findAll({
        where: {
            addresseeId: user.id,
            status: 'pending'
        },
        include: [
            {
                model: User,
                as: 'Addresser',
                attributes: ['id'],
                include: [
                    {
                        model: Character,
                        attributes: ['id', 'name', 'status', 'level']
                    }
                ]
            }
        ]
    });

    const requestObj = {};
    const requestList = [];

    sentRequests.forEach(request => {
        request = request.toJSON();
        const requestChar = request.Addressee.Character;
        const reqObj = {
            id: request.id,
            addresserId: request.addresserId,
            addresseeId: request.addresseeId,
            status: request.status,
            Character: requestChar
        };

        requestList.push(reqObj);
    });

    recievedRequests.forEach(request => {
        request = request.toJSON();
        const requestChar = request.Addresser.Character;
        const reqObj = {
            id: request.id,
            addresserId: request.addresserId,
            addresseeId: request.addresseeId,
            status: request.status,
            Character: requestChar
        };

        requestList.push(reqObj);
    });

    requestObj.Requests = requestList;

    return res.json(requestObj);
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
        // id = CharacterCustomization.id, equip is desired equipped state, true or false
        customizations.forEach(({ id, equip }) => {
            const customization = character.CharacterCustomizations.find(c => c.id === id);
            if (customization) {
                if (equip) {
                    // Unequip all items of the same type
                    character.CharacterCustomizations.forEach(c => {
                        if (c.CustomizationItem.type === customization.CustomizationItem.type) {
                            c.equipped = false;
                        }
                    });
                    customization.equipped = true; // Equip the intended item
                } else {
                    customization.equipped = false; // Directly set equipped to false
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
