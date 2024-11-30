const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { environment } = require('./config');
const { ValidationError, where } = require('sequelize');
const passport = require('passport');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
const { Op } = require('sequelize');

const { Chat } = require('./db/models')

const isProduction = environment === 'production';

const app = express();
const server = http.createServer(app);

const ioCorsOptions = isProduction
    ? {}
    : {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    };

const io = new Server(server, ioCorsOptions);

app.set('io', io);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

app.use(session({
    secret: process.env.OAUTH_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }));
}

// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

// Set the _csrf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

const routes = require('./routes');

// ...

app.use(routes); // Connect all the routes

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
            errors[error.path] = error.message;
        }
        err.title = 'Validation error';
        err.errors = errors;
    }
    next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join Global Chat
    socket.join('globalChat');
    socket.on('sendGlobalMessage', (messageData) => {
        io.to('globalChat').emit('recievedGlobalMessage', messageData);
    });

    // Join Private Chat
    socket.on('joinPrivateChat', ({ senderId, receiverId }) => {
        const roomName = [senderId, receiverId].sort().join('-');
        const rooms = Array.from(socket.rooms);

        if (!rooms.includes(roomName)) {
            socket.join(roomName);
            console.log(`Socket ${socket.id} joined room: ${roomName}`);
        }
    });

    const MESSAGE_LIMIT = 50;

    socket.on('sendPrivateMessage', async (messageData) => {
        const { senderId, receiverId, message } = messageData;

        const chatMessage = await Chat.create({ senderId, receiverId, message });

        const roomName = [senderId, receiverId].sort().join('-');

        const totalMessages = await Chat.count({
            where: {
                [Op.or]: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            },
        });

        if (totalMessages > MESSAGE_LIMIT) {
            const excessMessages = await Chat.findAll({
                where: {
                    [Op.or]: [
                        { senderId, receiverId },
                        { senderId: receiverId, receiverId: senderId },
                    ],
                },
                order: [['createdAt', 'ASC']],
                limit: totalMessages - MESSAGE_LIMIT,
            });

            await Chat.destroy({
                where: {
                    id: excessMessages.map(msg => msg.id),
                },
            });
        }

        io.to(roomName).emit('sendPrivateMessage', { ...chatMessage.toJSON(), originSocketId: socket.id });

        socket.emit('sendPrivateMessage', { ...chatMessage.toJSON(), originSocketId: socket.id });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

module.exports = { app, server };
