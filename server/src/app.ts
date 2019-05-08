import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import socketio from 'socket.io';
import * as http from 'http';
import passport from 'passport';

import Environment from './config/Environment';
import Database from './config/Database';
import Authentication from './config/Authentication';
import Logger from './util/Logger';
import auth from './routes/auth';
import api from './routes/api';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

async function start(): Promise<void> {
    // Verify environment
    try {
        await Environment.verifyEnvironment();
    } catch {
        Logger.error('Server startup canceled due to an error with the environment.')
    } finally {
        Logger.success('Environment verified');
    }

    try {
        Logger.info('Setting up database');
        await Database.connect();
        Logger.info('Creating tables');
        await Database.createSchema();
    } catch {
        Logger.error('Server startup canceled due to an error with the database.');
    } finally {
        Logger.success('Database Initialized');
    }

    app.use(session({
        secret: Environment.getSession(),
        resave: true,
        saveUninitialized: true,
    }));

    Authentication.setupStrategies();
    for (const strategy of Authentication.getStrategies()) {
        passport.use(strategy);
    }
    passport.serializeUser(Authentication.serialize);
    passport.deserializeUser(Authentication.deserialize);

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(express.json());
    app.use('/auth', auth);
    app.use('/api', api);

    server.listen(Environment.getPort());
    Logger.success('Server started');
}

start();
