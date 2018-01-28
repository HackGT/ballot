export class Environment {
    static getPort() {
        return process.env.PORT || '3000';
    }

    static isProduction() {
        return process.env.NODE_ENV == 'production';
    }
}