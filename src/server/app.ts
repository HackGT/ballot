import * as dotenv from 'dotenv';
dotenv.config();
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as express from 'express';
import { normalizePort, verifyEnvironment } from './util/server';
import { Environment } from './config/Environment';
import healthcheck from './routes/healthcheck';
import auth from './routes/auth';
import index from './routes/index';
import { Logger } from './util/Logger';
import * as session from 'express-session';
import * as passport from 'passport';
import { strategies, serialize, deserialize } from './config/auth';
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './api';
import { sync } from './models';

const app = express();

// Throw any errors if missing configurations
try {
    verifyEnvironment();

    // Sync database
    sync();

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
    app.use('/', express.static('./build/public'));
    app.use('/healthcheck', healthcheck);
    app.use('/auth', auth);
    app.use('/graphql', bodyParser.json(),
        graphqlExpress((req?: express.Request, res?: express.Response) => {
            return {
                schema,
                context: {
                    user: req!.user,
                },
            };
        }));
    app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
    app.use('*', index);

    // Start Server
    const port = Environment.getPort();
    app.listen(normalizePort(port), () => {
        Logger('app').info(`Listening on port ${port}`);
    });
} catch (error) {
    Logger('app').error('Server startup canceled due to missing dependencies');
    Logger('app').error(error);
}
