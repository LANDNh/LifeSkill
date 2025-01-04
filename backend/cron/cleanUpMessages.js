const cron = require('node-cron');
const { Chat } = require('../db/models');
const { Op, where } = require('sequelize');


const cleanUpMessages = () => {
    cron.schedule('* * * * *', async () => {
        try {
            console.log('Deleting all messages');
            await Chat.destroy({
                where: {},
                truncate: true
            });
            console.log('Messages deleted')
        } catch (e) {
            console.error('Error: ', e);
        }
    });
};

module.exports = cleanUpMessages;
