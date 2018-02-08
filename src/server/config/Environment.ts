interface IGithubConfig {
    clientID: string,
    clientSecret: string,
    callbackURL: string,
}

interface IFacebookConfig {
    clientID: string,
    clientSecret: string,
    callbackURL: string,
}

interface IGoogleConfig {
    clientID: string,
    clientSecret: string,
    callbackURL: string,
}

const githubAuthEnabled = process.env.AUTH_GITHUB_ID !== undefined &&
    process.env.AUTH_GITHUB_SECRET !== undefined &&
    process.env.AUTH_CALLBACK_URL !== undefined;

const facebookAuthEnabled = process.env.AUTH_FACEBOOK_ID !== undefined &&
    process.env.AUTH_FACEBOOK_SECRET !== undefined &&
    process.env.AUTH_CALLBACK_URL !== undefined;

const googleAuthEnabled = process.env.AUTH_GOOGLE_ID !== undefined &&
    process.env.AUTH_GOOGLE_SECRET !== undefined &&
    process.env.AUTH_CALLBACK_URL !== undefined;

const localAuthEnabled = (process.env.AUTH_ALLOW_LOCAL as string).toLowerCase().trim() === 'true';

export class Environment {
    public static getPort(): string | number {
        return process.env.PORT || '3000';
    }

    public static isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }

    public static getUrl(): string {
        return process.env.URL || '';
    }

    public static getSession(): string {
        return process.env.SESSION_SECRET || '';
    }

    public static getGithubAuth(): IGithubConfig | undefined {
        if (githubAuthEnabled) {
            return {
                clientID: process.env.AUTH_GITHUB_ID,
                clientSecret: process.env.AUTH_GITHUB_SECRET,
                callbackURL: process.env.AUTH_CALLBACK_URL
            } as IGithubConfig;
        }

        return undefined;
    }

    public static getFacebookAuth(): IFacebookConfig | undefined {
        if (facebookAuthEnabled) {
            return {
                clientID: process.env.AUTH_FACEBOOK_ID,
                clientSecret: process.env.AUTH_FACEBOOK_SECRET,
                callbackURL: process.env.AUTH_CALLBACK_URL
            } as IFacebookConfig;
        }

        return undefined;
    }

    public static getGoogleAuth(): IGoogleConfig | undefined {
        if (googleAuthEnabled) {
            return {
                clientID: process.env.AUTH_GOOGLE_ID,
                clientSecret: process.env.AUTH_GOOGLE_SECRET,
                callbackURL: process.env.AUTH_CALLBACK_URL
            } as IGoogleConfig;
        }

        return undefined;
    }

    public static allowLocalAuth(): boolean {
        return localAuthEnabled;
    }
}
