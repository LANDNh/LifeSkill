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

router.get('/current/:questId', requireAuth, async (req, res) => {
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

module.exports = router;
