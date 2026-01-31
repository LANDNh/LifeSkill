const cron = require('node-cron');
const { Quest } = require('../db/models');
const { Op } = require('sequelize');

const questSchedule = async () => {
    try {
        const now = new Date();

        const scheduledQuests = await Quest.findAll({
            where: {
                availableAt: {
                    [Op.lte]: now
                },
                complete: false
            },
        });

        for (const quest of scheduledQuests) {
            console.log(`Activating quest: ${quest.title}`);
        }
    } catch (e) {
        console.error('Error activating quests: ', e);
    }
};

cron.schedule('* * * * *', questSchedule);

module.exports = questSchedule;
