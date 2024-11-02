const express = require('express');
const { check } = require('express-validator');
const { Op } = require('sequelize');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Chat, Character } = require('../../db/models');

const router = express.Router();

// Get global chat hitsory
router.get('/', requireAuth, async (req, res) => {
    const globalChats = await Chat.findAll({
        where: {
            recieverId: null
        },
        order: [['createdAt', 'ASC']]
    });
    return res.json(globalChats);
});

// Get private message chat history
router.get('/:senderId/:receiverId', requireAuth, async (req, res) => {
    const { senderId, receiverId } = req.params;
    const privateChats = await Chat.findAll({
        where: {
            [Op.or]: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        },
        order: [['createdAt', 'ASC']]
    });
    return res.json(privateChats);
});

// Send a message
router.post('/send', requireAuth, async (req, res) => {
    const { senderId, receiverId, message } = req.body;
    const chat = await Chat.create({ senderId, receiverId, message });
    return res.json(chat);
});
module.exports = router;
