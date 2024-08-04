const express = require('express');
const { check } = require('express-validator');
const { Op, where } = require('sequelize');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Friend, Character } = require('../../db/models');

const router = express.Router();

//Get all characters that are friends with current character
router.get('/', requireAuth, async (req, res) => {
    const { user } = req;

    // Get friends that current character has sent a request to
    const addressedFriends = await Friend.findAll({
        where: {
            addresserId: user.id,
            status: 'accepted'
        },
        include: [
            {
                model: User,
                as: 'Addressee',
                attributes: ['id'],
                include: [
                    {
                        model: Character,
                        attributes: ['id', 'name', 'status', 'level', 'skin', 'eyes']
                    }
                ]
            }
        ]
    });

    // Get friends that sent request to current character
    const addressingFriends = await Friend.findAll({
        where: {
            addresseeId: user.id,
            status: 'accepted'
        },
        include: [
            {
                model: User,
                as: 'Addresser',
                attributes: ['id'],
                include: [
                    {
                        model: Character,
                        attributes: ['id', 'name', 'status', 'level', 'skin', 'eyes']
                    }
                ]
            }
        ]
    });

    const friendObj = {};
    const friendList = [];

    addressedFriends.forEach(friend => {
        friend = friend.toJSON();
        const friendChar = friend.Addressee.Character;
        const frObj = {
            id: friend.id,
            status: friend.status,
            Character: friendChar
        };
        friendList.push(frObj);
    });

    addressingFriends.forEach(friend => {
        friend = friend.toJSON();
        const friendChar = friend.Addresser.Character;
        const frObj = {
            id: friend.id,
            status: friend.status,
            Character: friendChar
        };
        friendList.push(frObj);
    });

    friendObj.Friends = friendList;

    return res.json(friendObj);
});

// Get all friend requests for current character, both recieved and sent
router.get('/requests', requireAuth, async (req, res) => {
    const { user } = req;

    // Get requests that current character has sent
    const sentRequests = await Friend.findAll({
        where: {
            addresserId: user.id,
            status: 'pending'
        },
        include: [
            {
                model: User,
                as: 'Addressee',
                attributes: ['id'],
                include: [
                    {
                        model: Character,
                        attributes: ['id', 'name', 'status', 'level', 'skin', 'eyes']
                    }
                ]
            }
        ]
    });

    // Get requests that have been sent to current character
    const receivedRequests = await Friend.findAll({
        where: {
            addresseeId: user.id,
            status: 'pending'
        },
        include: [
            {
                model: User,
                as: 'Addresser',
                attributes: ['id'],
                include: [
                    {
                        model: Character,
                        attributes: ['id', 'name', 'status', 'level', 'skin', 'eyes']
                    }
                ]
            }
        ]
    });

    const requestObj = {};
    const requestList = [];

    sentRequests.forEach(request => {
        request = request.toJSON();
        const reqObj = {
            id: request.id,
            addresserId: request.addresserId,
            addresseeId: request.addresseeId,
            status: request.status,
            Addressee: request.Addressee,
            type: 'sent'
        };

        requestList.push(reqObj);
    });

    receivedRequests.forEach(request => {
        request = request.toJSON();
        const reqObj = {
            id: request.id,
            addresserId: request.addresserId,
            addresseeId: request.addresseeId,
            status: request.status,
            Addresser: request.Addresser,
            type: 'received'
        };

        requestList.push(reqObj);
    });

    requestObj.Requests = requestList;

    return res.json(requestObj);
});

// Accept a friend request
router.put('/:requestId', requireAuth, async (req, res) => {
    const { user } = req;
    const { status } = req.body;
    const friendRequest = await Friend.findOne({
        where: {
            id: req.params.requestId,
            addresseeId: user.id,
            status: 'pending',
        },
        include: [
            {
                model: User,
                as: 'Addresser',
                attributes: ['id'],
                include: [
                    {
                        model: Character,
                        attributes: ['id', 'name', 'status', 'level', 'skin', 'eyes']
                    }
                ]
            }
        ]
    });

    if (!friendRequest) {
        return res.status(404).json({
            message: 'Friend request could not be found'
        });
    }

    friendRequest.set({
        status: status || friendRequest.status
    });

    await friendRequest.save();

    const friendRequestChar = {
        id: friendRequest.id,
        addresseeId: friendRequest.addresseeId,
        addresserId: friendRequest.addresserId,
        status: friendRequest.status,
        Character: friendRequest.Addresser.Character
    };

    return res.json(friendRequestChar);
});

// Reject a friend request or delete character from friends list
router.delete('/:friendId', requireAuth, async (req, res) => {
    const { user } = req;
    const sentFriend = await Friend.findOne({
        where: {
            id: req.params.friendId,
            addresserId: user.id,
            status: {
                [Op.in]: ['accepted', 'pending']
            }
        }
    });
    const recievedFriend = await Friend.findOne({
        where: {
            id: req.params.friendId,
            addresseeId: user.id,
            status: {
                [Op.in]: ['accepted', 'pending']
            }
        }
    });

    if (!sentFriend && !recievedFriend) {
        return res.status(404).json({
            message: 'Character is not on friend list'
        });
    } else if (sentFriend) {
        await sentFriend.destroy();
        return res.json({
            message: 'Successfully deleted'
        });
    } else if (recievedFriend) {
        await recievedFriend.destroy();
        return res.json({
            message: 'Successfully deleted'
        });
    }
});
module.exports = router;
