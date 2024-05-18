const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const charactersRouter = require('./characters.js');
const questsRouter = require('./quests.js');
const questStepsRouter = require('./queststeps.js');
const friendsRouter = require('./friends.js');
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/characters', charactersRouter);
router.use('/quests', questsRouter);
router.use('/quest-steps', questStepsRouter);
router.use('/friends', friendsRouter);

module.exports = router;
