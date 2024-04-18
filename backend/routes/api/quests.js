const express = require('express');
const { check } = require('express-validator');
const { Op, where } = require('sequelize');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Quest, QuestStep, Character } = require('../../db/models');

const router = express.Router();

const questAuthorize = async (req, res, next) => {
    const { user } = req;
    const quest = await Quest.findByPk(req.params.questId);

    if (!quest) {
        return res.status(404).json({
            message: 'Quest could not be found'
        });
    } else if (user.id !== quest.userId) {
        return res.status(403).json({
            message: 'Forbidden'
        });
    } else {
        next();
    }
};

const validateQuest = [
    check('title')
        .exists({ checkFalsy: true })
        .withMessage('Title is required'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('type')
        .exists({ checkFalsy: true })
        .withMessage('Type is required'),
    check('title')
        .custom(async val => {
            if (val.length < 1 || val.length > 100) {
                throw new Error('Title must be between 1 and 200 characters')
            }
        }),
    check('description')
        .custom(async val => {
            if (val.length < 1 || val.length > 200) {
                throw new Error('Description must be between 1 and 200 characters')
            }
        }),
    handleValidationErrors
]

//Get all quests owned by current user
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const quests = await Quest.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: QuestStep
            }
        ]
    });
    const questObj = {};
    const questList = [];

    quests.forEach(quest => {
        questList.push(quest.toJSON());
    });

    questList.forEach(quest => {
        let total = 0;
        quest.QuestSteps.forEach(step => {
            total += step.difficulty;
        });
        const difficultyAggregate = Math.round(total / quest.QuestSteps.length);
        quest.difficultyAggregate = difficultyAggregate;
        delete quest.QuestSteps;

        switch (quest.type) {
            case 'daily':
                quest.completionCoins = (quest.difficultyAggregate * 5);
                break;
            case 'weekly':
                quest.completionCoins = (quest.difficultyAggregate * 10);
                break;
            case 'monthly':
                quest.completionCoins = (quest.difficultyAggregate * 20);
                break;
            default:
                switch (quest.difficultyAggregate) {
                    case 2:
                        quest.completionCoins = 10;
                        break;
                    case 3:
                        quest.completionCoins = 25;
                        break;
                    case 4:
                        quest.completionCoins = 50;
                        break;
                    case 5:
                        quest.completionCoins = 100;
                        break;
                    default:
                        quest.completionCoins = 5;
                }
        }
    });

    questObj.Quests = questList;

    return res.json(questObj);
});

router.get('/current/:questId', requireAuth, questAuthorize, async (req, res) => {
    const { user } = req;
    const quest = await Quest.findOne({
        where: {
            userId: user.id
        },
        include: [
            {
                model: QuestStep
            }
        ]
    });
    if (!quest) {
        return res.status(404).json({
            message: 'Quest could not be found'
        });
    } else {
        let total = 0;
        quest.QuestSteps.forEach(step => {
            total += step.difficulty;
        });
        const difficultyAggregate = Math.round(total / quest.QuestSteps.length);
        quest.difficultyAggregate = difficultyAggregate;

        switch (quest.type) {
            case 'daily':
                quest.completionCoins = (quest.difficultyAggregate * 5);
                break;
            case 'weekly':
                quest.completionCoins = (quest.difficultyAggregate * 10);
                break;
            case 'monthly':
                quest.completionCoins = (quest.difficultyAggregate * 20);
                break;
            default:
                switch (quest.difficultyAggregate) {
                    case 2:
                        quest.completionCoins = 10;
                        break;
                    case 3:
                        quest.completionCoins = 25;
                        break;
                    case 4:
                        quest.completionCoins = 50;
                        break;
                    case 5:
                        quest.completionCoins = 100;
                        break;
                    default:
                        quest.completionCoins = 5;
                }
        }

        const questObj = {
            ...quest.dataValues,
            difficultyAggregate: quest.difficultyAggregate,
            completionCoins: quest.completionCoins
        };
        delete questObj.QuestSteps;

        return res.json(questObj);
    }
});

router.post('/current', requireAuth, validateQuest, async (req, res) => {
    const { user } = req;
    const { title, description, type } = req.body;

    const newQuest = await Quest.create({
        userId: user.id,
        title,
        description,
        type,
        difficultyAggregate: null,
        completionCoins: null
    });

    return res.json(newQuest);
});

module.exports = router;
