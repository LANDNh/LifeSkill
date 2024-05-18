const express = require('express');
const { check } = require('express-validator');
const { Op, where } = require('sequelize');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Friend, Character } = require('../../db/models');

const router = express.Router();

// Accept or reject a friend request
router.put('/:requestId', requireAuth, async (req, res) => {
    const { user } = req;
    const { status } = req.body;
    const friendRequest = await Friend.findOne({
        where: {
            id: req.params.requestId,
            addresseeId: user.id,
            status: 'pending'
        }
    });

    if (!friendRequest) {
        return res.status(404).json({
            message: 'Friend request could not be found'
        });
    }

    if (status === 'rejected') {
        await friendRequest.destroy();
        return res.json({
            message: 'Successfully rejected'
        });
    } else {
        friendRequest.set({
            status: status || friendRequest.status
        });

        await friendRequest.save();

        return res.json(friendRequest);
    }
});

module.exports = router;
