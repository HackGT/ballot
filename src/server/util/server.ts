import { Environment } from '../config/Environment';
import { Logger } from './Logger';
import { strategies } from '../config/auth';

const warn = Logger('server:startup').warn;

export function normalizePort(port: string): number | string | boolean {
    const parsedPort = parseInt(port, 10);
    if (isNaN(parsedPort)) {
        return port;
    }
    if (parsedPort >= 0) {
        return parsedPort;
    }
    return false;
}

export function verifyEnvironment(): void {
    if (Environment.getUrl() === '') {
        warn('URL is not defined in environment variables!');
        throw new Error('missing process.env.URL');
    }
    
    if(strategies.length === 0) {
        warn('There are no activated authentication strategies!');
        throw new Error('missing authentication strategy');
    }
}
