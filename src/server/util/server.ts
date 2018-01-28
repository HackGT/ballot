import { Environment } from "../config/Environment";
import { Logger } from "./Logger";

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

export function verifyEnvironment() {
    if (Environment.getUrl() === '') { 
        warn('URL is not defined in environment variables!');
        throw new Error('missing process.env.URL');
    }
}