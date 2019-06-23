import chalk from 'chalk';
import Logger from '../util/Logger';

export interface DatabaseConfig {
    url: string;
    name: string;
    port: number;
}

class Environment {
    public static getPort(): string {
        return process.env.PORT || '3000';
    }

    public static isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }

    public static getURL(): string {
        return process.env.URL || '127.0.0.1';
    }

    public static getSession(): string {
        return process.env.SESSION_SECRET || '';
    }

    public static getDatabaseConfig(): DatabaseConfig | undefined {
        if (process.env.MDBNAME && process.env.MDBURL && process.env.MDBPORT) {
            return {
                url: process.env.MDBURL,
                port: process.env.PGPORT ? parseInt((process.env.MDBPORT) as string, 10) : 27017,
                name: process.env.MDBNAME,
            };
        }

        return undefined;
    }

    public static verifyEnvironment(): boolean {
        Logger.info('Verifying Environment');

        if (this.getURL() === '') {
            Logger.error('URL is not defined in environment variables!');
            throw new Error('Missing process.env.URL');
        }

        if (this.getSession() === '') {
            Logger.error('Session Secret is not defined in environment variables!');
            throw new Error('Missing process.env.SESSION_SECRET');
        }

        if (this.getDatabaseConfig() === undefined) {
            Logger.error('The database configuration in environment variables is not complete!');
            throw new Error('Missing database environment variables');
        }

        return true;
    }
}

export default Environment;
