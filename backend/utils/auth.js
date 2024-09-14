const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/session/google/callback',
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        if (!email) {
            return done(new Error("Google account has no associated email"));
        }

        // Find or create the user in the database
        const [user, created] = await User.findOrCreate({
            where: { email },   // Use the email to find or create the user
            defaults: {
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: email,
                username: profile.displayName
            },
            attributes: ['id', 'firstName', 'lastName', 'email', 'username', 'googleId']
        });
        return done(null, user);
    } catch (e) {
        return done(e);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id, {
            attributes: ['id', 'firstName', 'lastName', 'email', 'username', 'googleId'],
        });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
};

const restoreUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.user = req.user;
        return next();
    }

    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
                attributes: {
                    include: ['email', 'createdAt', 'updatedAt']
                }
            });
        } catch (e) {
            res.clearCookie('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');

        return next();
    });
};

const requireAuth = (req, res, next) => {
    // Check if the user is authenticated via OAuth
    if (req.isAuthenticated()) {
        return next(); // User is authenticated via OAuth
    }

    // If no OAuth session, check for a JWT token
    const { token } = req.cookies;

    if (!token) {
        // If neither an OAuth session nor a JWT is found, return an error
        const err = new Error('Authentication required');
        err.status = 401;
        return next(err);
    }

    // Verify the JWT token
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            const authError = new Error('Invalid token');
            authError.status = 401;
            return next(authError);
        }

        // If JWT is valid, attach the user to the request
        req.user = decoded.data;
        return next();
    });
};

module.exports = { setTokenCookie, restoreUser, requireAuth };
