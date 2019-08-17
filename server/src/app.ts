import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import socketio from 'socket.io';
import * as http from 'http';
import passport from 'passport';
import 'reflect-metadata';

import Environment from './config/Environment';
import Database from './config/Database';
import Logger from './util/Logger';
import auth from './routes/auth';
import api from './routes/api';
import Authentication from './config/Authentication';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

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

    app.use(session({
        secret: Environment.getSession(),
        resave: true,
        saveUninitialized: true,
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
