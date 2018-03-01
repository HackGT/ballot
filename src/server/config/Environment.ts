interface IGithubConfig {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
}

interface IFacebookConfig {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
}

interface IGoogleConfig {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
}

export interface IDatabaseConfig {
    host: string;
    database: string;
    username: string;
    password: string;
    port?: number;
}

export interface IDatabaseConfigURI {
    uri: string;
}

export class Environment {
    public static getPort(): string {
        return process.env.PORT || '3000';
    }

    public static isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }

    public static getUrl(): string {
        return process.env.URL || '127.0.0.1';
    }

    public static getSession(): string {
        return process.env.SESSION_SECRET || '';
    }

    public static getDatabaseConfig(): IDatabaseConfig | IDatabaseConfigURI | undefined {
        if (process.env.PGURL &&
            process.env.PGUSERNAME &&
            process.env.PGDATABASE &&
            process.env.PGPASSWORD) {
            return {
                host: process.env.PGURL,
                port: process.env.PGPORT ? parseInt((process.env.PGPORT) as string, 10) : undefined,
                database: process.env.PGDATABASE,
                username: process.env.PGUSERNAME,
                password: process.env.PGPASSWORD,
            };
        }

        if (process.env.POSTGRES_URL) {
            return {
                uri: process.env.POSTGRES_URL,
            };
        }

        return undefined;
    }

    public static getGithubAuth(): IGithubConfig | undefined {
        if (process.env.AUTH_GITHUB_ID &&
            process.env.AUTH_GITHUB_SECRET) {
            return {
                clientID: process.env.AUTH_GITHUB_ID,
                clientSecret: process.env.AUTH_GITHUB_SECRET,
                callbackURL: '/auth/github/callback',
            } as IGithubConfig;
        }

        return undefined;
    }

    public static getFacebookAuth(): IFacebookConfig | undefined {
        if (process.env.AUTH_FACEBOOK_ID &&
            process.env.AUTH_FACEBOOK_SECRET) {
            return {
                clientID: process.env.AUTH_FACEBOOK_ID,
                clientSecret: process.env.AUTH_FACEBOOK_SECRET,
                callbackURL: '/auth/facebook/callback',
                profileFields: ['id', 'name', 'email', 'displayName'],
            } as IFacebookConfig;
        }

        return undefined;
    }

    public static getGoogleAuth(): IGoogleConfig | undefined {
        if (process.env.AUTH_GOOGLE_ID &&
            process.env.AUTH_GOOGLE_SECRET) {
            return {
                clientID: process.env.AUTH_GOOGLE_ID,
                clientSecret: process.env.AUTH_GOOGLE_SECRET,
                callbackURL: '/auth/google/callback',
            } as IGoogleConfig;
        }

        return undefined;
    }

    public static allowLocalAuth(): boolean {
        return !!process.env.AUTH_ALLOW_LOCAL &&
            (process.env.AUTH_ALLOW_LOCAL as string)!.toLowerCase().trim() === 'true';
    }
}
