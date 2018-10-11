import * as dotenv from 'dotenv';
dotenv.config();

import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as express from 'express';
import * as session from 'express-session';
import * as http from 'http';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import * as socketio from 'socket.io';
import * as path from 'path';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { normalizePort, verifyEnvironment } from './util/server';
import { Environment } from './config/Environment';
import healthcheck from './routes/healthcheck';
import auth from './routes/auth';
import { Logger } from './util/Logger';
import { strategies, serialize, deserialize } from './config/auth';
import schema from './api';
import { sync } from './models';
import socketHandler from './routes/socket';
import { createDataStore } from './store/DataStore';

const app = express();
const server = http.createServer(app);
export const io = socketio(server);

async function start(): Promise<void> {
    // Throw any errors if missing configurations
    try {
        await verifyEnvironment();

        // Sync database
        await sync();

        await createDataStore();

        // Integrate Helmet
        app.use(helmet());
        app.use(helmet.noCache());
        app.use(helmet.hsts({
            maxAge: 31536000,
            includeSubdomains: true,
        }));

        // Integrate Cors
        app.use(cors());

        // Integrate Logging
        app.use(morgan('dev'));

        // Integrate Authentication
        app.use(session({
            secret: Environment.getSession(),
            resave: true,
            saveUninitialized: true,
        }));

        for (const strategy of strategies) {
            passport.use(strategy);
        }
        passport.serializeUser(serialize);
        passport.deserializeUser(deserialize);

        app.use(passport.initialize());
        app.use(passport.session());

        // Activate Routes
        app.use('/graphql', bodyParser.json({
            limit: '10mb',
        }),
            graphqlExpress((req?: express.Request, res?: express.Response) => {
                return {
                    schema,
                    context: {
                        user: req!.user,
                    },
                };
            })
        );

        app.use('/auth', auth);

        app.use('/', express.static('./build/public/client'));
        app.use('/', express.static('./build/public/dashboard'));
        app.use('/dashboard/*', (req, res) => {
            res.sendFile(path.resolve(__dirname, './public/dashboard/index.html'));
        });

        app.use('/*', (req, res) => {
            res.sendFile(path.resolve(__dirname, './public/client/index.html'));
        });

        app.use('/healthcheck', healthcheck);
        app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
        // app.use('*', index);

        // Activate sockets
        io.on('connection', socketHandler);

        // Start Server
        const port = Environment.getPort();
        server.listen(normalizePort(port));

        // app.listen(normalizePort(port), () => {
        //     Logger('app').info(`Listening on port ${port}`);
        // });
    } catch (error) {
        Logger('app').error('Server startup canceled due to missing dependencies');
        Logger('app').error(error);
    }
}

start()
