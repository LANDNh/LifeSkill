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
            if (val && (val.length < 1 || val.length > 100)) {
                throw new Error('Title must be between 1 and 200 characters')
            }
        }),
    check('description')
        .custom(async val => {
            if (val && (val.length < 1 || val.length > 200)) {
                throw new Error('Description must be between 1 and 200 characters')
            }
        }),
    handleValidationErrors
];

const validateQuestStep = [
    check('title')
        .exists({ checkFalsy: true })
        .withMessage('Title is required'),
    check('difficulty')
        .exists({ checkFalsy: true })
        .withMessage('Must select difficulty of D, C, B, A or S'),
    check('title')
        .custom(async val => {
            if (val && (val.length < 1 || val.length > 100)) {
                throw new Error('Title must be between 1 and 100 characters')
            }
        }),
    check('difficulty')
        .custom(async val => {
            if (val < 1 || val > 5) {
                throw new Error('Must select difficulty of D, C, B, A or S')
            }
        }),
    check('notes')
        .custom(async val => {
            if (val && (val.length < 1 || val.length > 200)) {
                throw new Error('Notes must be between 1 and 200 characters')
            }
        }),
    handleValidationErrors
];

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
                    case 1:
                        quest.completionCoins = 5;
                        break;
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
                        quest.completionCoins = null;
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
                    case 1:
                        quest.completionCoins = 5;
                        break;
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
                        quest.completionCoins = null;
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

router.get('/current/:questId/quest-steps', requireAuth, questAuthorize, async (req, res) => {
    const quest = await Quest.findByPk(req.params.questId);
    const questSteps = await QuestStep.findAll({
        where: {
            questId: quest.id
        },
        attributes: ['id', 'questId', 'title', 'notes', 'difficulty', 'xp', 'complete']
    });
    const stepObj = {};
    const stepList = [];

    questSteps.forEach(questStep => {
        stepList.push(questStep.toJSON());
    });

    stepObj.QuestSteps = stepList;

    return res.json(stepObj);
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

router.post('/current/:questId/quest-steps', requireAuth, questAuthorize, validateQuestStep, async (req, res) => {
    const quest = await Quest.findByPk(req.params.questId);
    const { title, notes, difficulty } = req.body;
    const existingQuestStep = await QuestStep.findOne({
        where: {
            questId: quest.id,
            title: title
        },
    });

    if (existingQuestStep) {
        return res.status(400).json({
            message: "Quest step with this title already exists for this quest."
        });
    }

    let xp = 5; // Default xp
    if (difficulty === 2) xp = 10;
    else if (difficulty === 3) xp = 20;
    else if (difficulty === 4) xp = 40;
    else if (difficulty === 5) xp = 80;

    const newQuestStep = await QuestStep.create({
        questId: quest.id,
        title,
        notes,
        difficulty,
        xp
    });

    const questSteps = await QuestStep.findAll({
        where: {
            questId: quest.id
        }
    });

    let total = 0;
    questSteps.forEach(step => {
        total += step.difficulty;
    });
    const difficultyAggregate = Math.round(total / questSteps.length);


    let completionCoins;
    switch (quest.type) {
        case 'daily':
            completionCoins = (difficultyAggregate * 5);
            break;
        case 'weekly':
            completionCoins = (difficultyAggregate * 10);
            break;
        case 'monthly':
            completionCoins = (difficultyAggregate * 20);
            break;
        default:
            switch (difficultyAggregate) {
                case 1:
                    completionCoins = 5;
                    break;
                case 2:
                    completionCoins = 10;
                    break;
                case 3:
                    completionCoins = 25;
                    break;
                case 4:
                    completionCoins = 50;
                    break;
                case 5:
                    completionCoins = 100;
                    break;
                default:
                    completionCoins = null;
            }
    }

    await quest.update({
        difficultyAggregate: difficultyAggregate,
        completionCoins: completionCoins
    });

    return res.json(newQuestStep);
});

router.put('/current/:questId', requireAuth, questAuthorize, validateQuest, async (req, res) => {
    const { title, description, type, complete } = req.body;
    const quest = await Quest.findByPk(req.params.questId);

    quest.set({
        title: title || quest.title,
        description: description || quest.description,
        type: type || quest.type,
        complete: complete !== undefined ? complete : quest.complete
    });

    await quest.save();

    if (quest.complete) {
        const { user } = req;
        const character = await Character.findOne({
            where: {
                userId: user.id
            }
        });

        if (!character) {
            return res.status(404).json({
                message: 'Character could not be found'
            });
        }

        if (quest.completionCoins) {
            character.totalCoins += quest.completionCoins;
        }

        await character.save();
        await quest.destroy();

        return res.json({
            message: 'Quest completed'
        });
    }

    return res.json(quest);
});

router.delete('/current/:questId', requireAuth, questAuthorize, async (req, res) => {
    const quest = await Quest.findByPk(req.params.questId);

    await quest.destroy();

    return res.json({
        message: 'Successfully deleted'
    });
});

module.exports = router;
