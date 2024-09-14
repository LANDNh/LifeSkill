const express = require('express');
const passport = require('passport');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];

const isProduction = process.env.NODE_ENV === "production";

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
}), async (req, res) => {
    const user = req.user;

    console.log(user)

    await setTokenCookie(res, user);

    if (!isProduction) {
        res.redirect('http://localhost:5173');
    } else {
        res.redirect('https://lifeskill.onrender.com')
    }
});

// Restore session user
router.get(
    '/',
    (req, res) => {
        const { user } = req;
        if (user) {
            const safeUser = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
            };

            if (safeUser) {
                return res.json({
                    user: safeUser
                });
            }
        } else return res.json({ user: null });
    }
);

//Log in
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
        const { credential, password } = req.body;

        const user = await User.unscoped().findOne({
            where: {
                [Op.or]: {
                    username: credential,
                    email: credential
                }
            }
        });

        if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
            const err = new Error('Login failed');
            err.status = 401;
            err.title = 'Login failed';
            err.errors = { credential: 'The provided credentials were invalid.' };
            return next(err);
        }

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };

        if (safeUser) {
            await setTokenCookie(res, safeUser);

            return res.json({
                user: safeUser
            });
        }
    }
);

// Log out
router.delete('/', (req, res) => {
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie('token');
            return res.json({ message: 'success' });
        });
    } else {
        res.clearCookie('token');
        return res.json({ message: 'success' });
    }
}
);

module.exports = router;
