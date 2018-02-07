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
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

// Throw any errors if missing configurations
try {
    verifyEnvironment();

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

    // Activate Routes
    app.use('/', index);
    app.use('/healthcheck', healthcheck);
    app.use('/auth', auth);

    // Start Server
    const port = Environment.getPort();
    app.listen(normalizePort('3000'), () => {
        console.log(`Listening on port ${port}`);
    });
} catch (error) {
    Logger('server:startup').error('Server startup canceled due to missing dependencies');
}



