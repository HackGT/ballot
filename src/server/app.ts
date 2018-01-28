import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import { normalizePort } from './util/server';
import { Environment } from './config/Environment';

const app = express();

// Integrate Helmet
app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubdomains: true
}));

// Integrate Cors
app.use(cors());

// Integrate Logging
app.use(morgan('dev'));

// Start Server
const port = Environment.getPort();
const server = app.listen(normalizePort('3000'));
server.on('listening', ()=>{
    console.log(`Listening on ${this.bind(server.address())}`);
})