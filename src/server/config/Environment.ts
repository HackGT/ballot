interface GithubConfig {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
}

interface FacebookConfig {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
}

interface GoogleConfig {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
}

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

    public static getDatabaseConfig(): DatabaseConfig | DatabaseConfigURI | undefined {
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

    public static getGithubAuth(): GithubConfig | undefined {
        if (process.env.AUTH_GITHUB_ID &&
            process.env.AUTH_GITHUB_SECRET &&
            process.env.AUTH_ALLOW_GITHUB) {
            return {
                clientID: process.env.AUTH_GITHUB_ID,
                clientSecret: process.env.AUTH_GITHUB_SECRET,
                callbackURL: '/auth/github/callback',
            } as GithubConfig;
        }

        return undefined;
    }

    public static getFacebookAuth(): FacebookConfig | undefined {
        if (process.env.AUTH_FACEBOOK_ID &&
            process.env.AUTH_FACEBOOK_SECRET &&
            process.env.AUTH_ALLOW_FACEBOOK) {
            return {
                clientID: process.env.AUTH_FACEBOOK_ID,
                clientSecret: process.env.AUTH_FACEBOOK_SECRET,
                callbackURL: '/auth/facebook/callback',
                profileFields: ['id', 'name', 'email', 'displayName'],
            } as FacebookConfig;
        }

        return undefined;
    }

    public static getGoogleAuth(): GoogleConfig | undefined {
        if (process.env.AUTH_GOOGLE_ID &&
            process.env.AUTH_GOOGLE_SECRET &&
            process.env.AUTH_ALLOW_GOOGLE) {
            return {
                clientID: process.env.AUTH_GOOGLE_ID,
                clientSecret: process.env.AUTH_GOOGLE_SECRET,
                callbackURL: '/auth/google/callback',
            } as GoogleConfig;
        }

        return undefined;
    }

    public static allowLocalAuth(): boolean {
        return !!process.env.AUTH_ALLOW_LOCAL &&
            (process.env.AUTH_ALLOW_LOCAL as string)!.toLowerCase().trim() === 'true';
    }
}
