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

interface IDatabaseConfig {
    host: string;
    database: string;
    username: string;
    password: string;
    port: number;
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

    public static getDatabaseConfig(): IDatabaseConfig | undefined {
        if (process.env.POSTGRES_URL &&
            process.env.USERNAME &&
            process.env.DBNAME) {
            return {
                host: process.env.POSTGRES_URL,
                port: process.env.PGPORT ? parseInt((process.env.PGPORT) as string, 10) : undefined,
                database: process.env.DBNAME,
                username: process.env.USERNAME,
                password: process.env.PGPASSWORD,
            } as IDatabaseConfig;
        }

        if(!process.env.POSTGRES_URL)
            throw new Error('Expected env POSTGRES_URL');
        if(!process.env.USERNAME)
            throw new Error('Expected env USERNAME');
        if(!process.env.DBNAME)
            throw new Error('Expected env DBNAME');

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
