import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import * as http from 'http';
import passport from 'passport';
import socketio from 'socket.io';
import store from 'connect-pg-simple';
import passportSocketIO from 'passport.socketio';
import 'reflect-metadata';

import Environment from './config/Environment';
import Database from './config/Database';
import Logger from './util/Logger';
import auth from './routes/auth';
import api from './routes/api';
import Authentication from './config/Authentication';
import socketHandler from './routes/socket';

const app = express();
const server = http.createServer(app);
export const io = socketio(server);

async function start(): Promise<void> {
    // Verify environment
    try {
        await Environment.verifyEnvironment();
    } catch (error) {
        Logger.error('Server startup canceled due to an error with the environment.');
        throw new Error(error);
    }
    Logger.success('Environment verified');

    try {
        Logger.info('Setting up database');
        await Database.connect();
    } catch (error) {
        Logger.error('Server startup canceled due to an error with the database.');
        throw new Error(error);
    }
    Logger.success('Database Initialized');

    const pgSessionStore = store(session);

    const sessionMiddleware = session({
        store: new pgSessionStore({
            conObject: Database.getConnectionObject(),
        }),
        secret: Environment.getSessionSecret(),
        resave: true,
        saveUninitialized: true,
    });

    app.use(sessionMiddleware).use(cookieParser());

    io.on('connection', socketHandler);
    io.use(passportSocketIO.authorize({
        cookieParser: require('cookie-parser'),
        secret: Environment.getSessionSecret(),
        store: new pgSessionStore({
            conObject: Database.getConnectionObject(),
        }),
        // success: (data, accept) => {
        //     console.log(data.user);
        //     accept()
        // },
        // fail: (data, message, error, accept) => {
        //     accept();
        // }
    }));

    try {
        Logger.info('Setting up Passport');
        Authentication.setupStrategies();
        for (const strategy of Authentication.getStrategies()) {
            passport.use(strategy);
        }
        passport.serializeUser(Authentication.serialize);
        passport.deserializeUser(Authentication.deserialize);

        app.use(passport.initialize());
        app.use(passport.session());
    } catch (error) {
        Logger.error('Server startup canceled due to an error with Passport');
        throw new Error(error);
    }

    app.use(express.json());
    app.use('/auth', auth);
    app.use('/api', api);

    server.listen(Environment.getPort());
    Logger.success('Server started');
}

start();
