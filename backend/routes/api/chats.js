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

    if (privateChats.length) {
        return res.json(privateChats);
    } else {
        return res.json([]);
    }
});

// Send a message
router.post('/send', requireAuth, async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    const io = req.app.get('io'); // Get the io instance
    if (!io) {
        return res.status(500).json({ error: "Socket.IO instance not found" });
    }

    const roomName = [senderId, receiverId].sort().join('-');
    const messageData = { senderId, receiverId, message };

    // Emit the message via Socket.IO
    io.to(roomName).emit('sendPrivateMessage', messageData);

    return res.json({ success: true, message: "Message sent to socket" });
});
module.exports = router;
