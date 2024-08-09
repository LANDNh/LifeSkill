const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('email')
        .custom(async val => {
            const user = await User.findOne({ where: { email: val } });

            if (user) {
                throw new Error('User with that email already exists')
            }
        }),
    check('username')
        .exists({ checkFalsy: true })
        .withMessage('Username is required'),
    check('username')
        .custom(async val => {
            if (!val || val.length < 4 || val.length > 50) {
                throw new Error('Username must be between 4 and 50 characters')
            }
        }),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('username')
        .custom(async val => {
            const user = await User.findOne({ where: { username: val } });

            if (user) {
                throw new Error('User with that username already exists')
            }
        }),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First name is required'),
    check('firstName')
        .custom(async val => {
            if (!val || val.length < 3 || val.length > 50) {
                throw new Error('First name must be between 3 and 50 characters')
            }
        }),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last Name is required'),
    check('lastName')
        .custom(async val => {
            if (!val || val.length < 3 || val.length > 50) {
                throw new Error('Last name must be between 3 and 50 characters')
            }
        }),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.')
        .custom(value => {
            const errors = [];

            if (!/\d/.test(value)) {
                errors.push('Password must contain at least one number.');
            }

            if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                errors.push('Password must contain at least one special character.');
            }

            if (errors.length > 0) {
                throw new Error(errors.join(' '));
            }

            return true;
        }),
    handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res) => {
    try {
        const { firstName, lastName, email, password, username } = req.body;
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({ firstName, lastName, email, username, hashedPassword });
        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username
        };

        await setTokenCookie(res, safeUser);

        res.json({
            user: safeUser
        });
    } catch (err) {
        const errObj = {};

        err.errors.forEach(e => {
            console.log(e)
            if (e.path === 'email') {
                errObj.email = 'User with that email already exists'
            } else {
                errObj.username = 'User with that username already exists'
            }
        });

        return res.status(500).json({
            message: 'User already exists',
            errors: errObj
        });
    }
});

module.exports = router;
