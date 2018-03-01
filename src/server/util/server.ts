import { Environment, DatabaseConfig } from '../config/Environment';
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

    if (Environment.getSession() === '') {
        warn('Session Secret is not defined in environment variables!');
        throw new Error('missing process.env.SESSION_SECRET');
    }

    if (strategies.length === 0) {
        warn('There are no activated authentication strategies!');
        throw new Error('missing authentication strategy');
    }

    if (Environment.getDatabaseConfig() === undefined) {
        warn('The configuration variables are not defined in environment variables!');
        throw new Error('mising database envars');
    }

    if ((Environment.getDatabaseConfig() as DatabaseConfig)!.password === undefined) {
        warn('The database has no password set');
    }
}
