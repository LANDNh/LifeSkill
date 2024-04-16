const express = require('express');
const { check } = require('express-validator');
const { Op } = require('sequelize');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Character, CustomizationItem, CharacterCustomization } = require('../../db/models');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    const { user } = req
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
        charList.push(character.toJSON())
    });

    charObj.Characters = charList;

    return res.json(charObj);
});

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req
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

    if (!user) {
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

module.exports = router;
