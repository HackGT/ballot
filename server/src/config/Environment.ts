import chalk from 'chalk';

export interface DatabaseConfig {
    host: string;
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

    public static getSession(): string {
        return process.env.SESSION_SECRET || '';
    }

    public static getDatabaseConfig(): DatabaseConfig | DatabaseConfigURI | undefined {
        if (process.env.POSTGRES_URL) {
            return {
                uri: process.env.POSTGRES_URL,
            };
        }

        if (process.env.PGURL && process.env.PGUSERNAME && process.env.PGDATABASE && process.env.PGPASSWORD) {
            return {
                host: process.env.PGURL,
                port: process.env.PGPORT ? parseInt((process.env.PGPORT) as string, 10) : undefined,
                database: process.env.PGDATABASE,
                username: process.env.PGUSERNAME,
                password: process.env.PGPASSWORD,
            };
        }

        return undefined;
    }

    public static verifyEnvironment(): boolean {
        console.info(chalk.blueBright('[Info]'), 'Verifying environment');

        if (this.getURL() === '') {
            console.error(chalk.bgRed('[Error]'), 'URL is not defined in environment variables!');
            throw new Error('Missing process.env.URL');
        }

        if (this.getSession() === '') {
            console.error(chalk.redBright('[Error]'), 'Session Secret is not defined in environment variables!');
            throw new Error('Missing process.env.SESSION_SECRET');
        }

        if (this.getDatabaseConfig() === undefined) {
            console.error(chalk.redBright('[Error]'), 'The database configuration in environment variables is not complete!');
            throw new Error('Missing database environment variables');
        }

        return true;
    }
}

export default Environment;
