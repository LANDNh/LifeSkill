const cron = require('node-cron');
const { Chat } = require('../db/models');
const { Op, where } = require('sequelize');

const cleanUpMessages = () => {
    // Set up cron job to run at midnight daily to remove messages older than 24 hours
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Deleting all messages older than 24 hours');

            const cuttOffDate = new Date();
            cuttOffDate.setHours(cuttOffDate.getHours() - 24);

            await Chat.destroy({
                where: {
                    createdAt: {
                        [Op.lt]: cuttOffDate,
                    },
                },
                truncate: true
            });

            console.log('Messages deleted successfully');
        } catch (e) {
            console.error('Error: ', e);
        }
    });
};

module.exports = cleanUpMessages;
