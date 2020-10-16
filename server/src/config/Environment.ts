import Logger from '../util/Logger';

export interface DatabaseConfig {
    url: string;
    database: string;
    username: string;
    password: string;
    port?: number;
}

export interface DatabaseConfigURI {
    uri: string;
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

    public static getSessionSecret(): string {
        return process.env.SESSION_SECRET || '';
    }

    public static getDatabaseConfig(): DatabaseConfig | DatabaseConfigURI | undefined {
        if (process.env.POSTGRES_URL) {
            // assume k8 url of form postgres://expo-2019@postgres-postgresql/expo-2019?sslmode=disable
            // strip query params
            const urlRootIndex = process.env.POSTGRES_URL.lastIndexOf('?');
            const urlRoot = urlRootIndex === -1 ?
                process.env.POSTGRES_URL : process.env.POSTGRES_URL.substring(0, urlRootIndex);
            return {
                uri: urlRoot,
            };
            // return {
            //     uri: process.env.POSTGRES_URL,
            // };
        }

        if (process.env.PGURL && process.env.PGUSERNAME && process.env.PGDATABASE && process.env.PGPASSWORD) {
            return {
                url: process.env.PGURL,
                port: process.env.PGPORT ? parseInt((process.env.PGPORT) as string, 10) : undefined,
                database: process.env.PGDATABASE,
                username: process.env.PGUSERNAME,
                password: process.env.PGPASSWORD,
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

        if (this.getSessionSecret() === '') {
            Logger.error('Session Secret is not defined in environment variables!');
            throw new Error('Missing process.env.SESSION_SECRET');
        }

        if (this.getDatabaseConfig() === undefined) {
            Logger.error('The database configuration in environment variables is not complete!');
            throw new Error('Missing database environment variables');
        }

        return true;
    }

    public static getSubmitURL(): string {
        return process.env.SUBMIT_URL || 'submit.hack.gt';
    }

    public static getSubmitSecret(): string {
        return process.env.SUBMIT_SECRET || '';
    }
}

export default Environment;
