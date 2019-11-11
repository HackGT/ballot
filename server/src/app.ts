import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import * as http from 'http';
import passport from 'passport';
import socketio from 'socket.io';
import store from 'connect-pg-simple';
import * as path from 'path';
import passportSocketIO from 'passport.socketio';
import pg from 'pg';
import 'reflect-metadata';

import Environment, { DatabaseConfigURI } from './config/Environment';
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

    // console.log((Environment.getDatabaseConfig() as DatabaseConfigURI).uri);

    // const pgPool = new pg.Pool({
    //     max: 1000,
    //     idleTimeoutMillis: 30000,
    //     connectionString: (Environment.getDatabaseConfig() as DatabaseConfigURI).uri,
    //     ssl: false,
    //     // ...Database.getConnectionObject(),
    // })

    const pgStore = new pgSessionStore({
        pruneSessionInterval: false,
        conString: process.env.POSTGRES_URL,
    });

    // console.log((Environment.getDatabaseConfig() as DatabaseConfigURI).uri);
    const sessionMiddleware = session({
        store: pgStore,
        secret: Environment.getSessionSecret(),
        resave: true,
        saveUninitialized: true,
    });

    app.use(sessionMiddleware).use(cookieParser());

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

    io.on('connection', socketHandler);
    io.use((socket, next) => {
        // console.log('wowowowow');
        passportSocketIO.authorize({
            cookieParser: require('cookie-parser'),
            secret: Environment.getSessionSecret(),
            store: pgStore,
        })(socket, next);
    });

    app.use(express.static(path.join(__dirname, '../build/public')));
    app.use(express.json());
    app.use('/auth', auth);
    app.use('/api', api);
    app.use('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, './public/index.html'));
    });

    server.listen(Environment.getPort());
    Logger.success('Server started');
}

start();
