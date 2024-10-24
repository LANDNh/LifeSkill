const express = require('express');
const { check } = require('express-validator');
const { Op, where, Model } = require('sequelize');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { QuestStep, Quest, Character } = require('../../db/models');

const router = express.Router();

const questStepAuthorize = async (req, res, next) => {
    const { user } = req;
    const questStep = await QuestStep.findByPk(req.params.questStepId);

    if (!questStep) {
        return res.status(404).json({
            message: 'Quest Step could not be found'
        });
    }

    const quest = await Quest.findOne({
        where: {
            id: questStep.questId,
            userId: user.id
        }
    })

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

const validateQuestStep = [
    check('title')
        .exists({ checkFalsy: true })
        .withMessage('Title is required'),
    check('difficulty')
        .exists({ checkFalsy: true })
        .withMessage('Must select difficulty of D, C, B, A or S'),
    check('complete')
        .exists()
        .withMessage('Completion status is required'),
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

// Edit quest step
router.put('/:questStepId', requireAuth, questStepAuthorize, validateQuestStep, async (req, res) => {
    const questStep = await QuestStep.findByPk(req.params.questStepId);
    const { title, notes, complete } = req.body;
    let { difficulty } = req.body
    const existingQuestStep = await QuestStep.findOne({
        where: {
            id: {
                [Op.ne]: req.params.questStepId
            },
            questId: questStep.questId,
            title: title
        },
    });
    const quest = await Quest.findOne({
        where: {
            id: questStep.questId
        },
        include: [
            {
                model: QuestStep
            }
        ]
    });

    if (existingQuestStep) {
        return res.status(400).json({
            message: "Quest step with this title already exists for this quest."
        });
    }

    difficulty = Number(difficulty) || Number(questStep.difficulty);

    let xp = 5; // Default xp
    if (difficulty === 2) xp = 10;
    else if (difficulty === 3) xp = 20;
    else if (difficulty === 4) xp = 40;
    else if (difficulty === 5) xp = 80;

    questStep.set({
        title: title || questStep.title,
        notes: notes || questStep.notes,
        difficulty,
        xp,
        complete: complete !== undefined ? complete : questStep.complete
    });

    await questStep.save();

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

    await quest.save();

    // Add xp to user character upon completion
    if (questStep.complete) {
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

        character.totalXp += questStep.xp;

        if (character.totalXp >= 100) {
            character.totalXp -= 100;
            character.level += 1;
        }

        await character.save();
    }

    return res.json(questStep);
});

// Delete quest step
router.delete('/:questStepId', requireAuth, questStepAuthorize, async (req, res) => {
    const questStep = await QuestStep.findByPk(req.params.questStepId);
    const quest = await Quest.findOne({
        where: {
            id: questStep.questId
        },
        include: [
            {
                model: QuestStep
            }
        ]
    });

    await questStep.destroy();

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

    await quest.save();

    return res.json({
        message: 'Successfully deleted'
    });
});

module.exports = router;
