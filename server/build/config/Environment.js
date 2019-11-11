"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../util/Logger"));
class Environment {
    static getPort() {
        return process.env.PORT || '3000';
    }
    static isProduction() {
        return process.env.NODE_ENV === 'production';
    }
    static getURL() {
        return process.env.URL || '127.0.0.1';
    }
    static getSessionSecret() {
        return process.env.SESSION_SECRET || '';
    }
    static getDatabaseConfig() {
        if (process.env.POSTGRES_URL) {
            const urlRootIndex = process.env.POSTGRES_URL.lastIndexOf('?');
            const urlRoot = urlRootIndex === -1 ?
                process.env.POSTGRES_URL : process.env.POSTGRES_URL.substring(0, urlRootIndex);
            return {
                uri: urlRoot,
            };
        }
        if (process.env.PGURL && process.env.PGUSERNAME && process.env.PGDATABASE && process.env.PGPASSWORD) {
            return {
                url: process.env.PGURL,
                port: process.env.PGPORT ? parseInt((process.env.PGPORT), 10) : undefined,
                database: process.env.PGDATABASE,
                username: process.env.PGUSERNAME,
                password: process.env.PGPASSWORD,
            };
        }
        return undefined;
    }
    static verifyEnvironment() {
        Logger_1.default.info('Verifying Environment');
        if (this.getURL() === '') {
            Logger_1.default.error('URL is not defined in environment variables!');
            throw new Error('Missing process.env.URL');
        }
        if (this.getSessionSecret() === '') {
            Logger_1.default.error('Session Secret is not defined in environment variables!');
            throw new Error('Missing process.env.SESSION_SECRET');
        }
        if (this.getDatabaseConfig() === undefined) {
            Logger_1.default.error('The database configuration in environment variables is not complete!');
            throw new Error('Missing database environment variables');
        }
        return true;
    }
}
exports.default = Environment;
