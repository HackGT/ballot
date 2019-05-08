"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
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
    static getSession() {
        return process.env.SESSION_SECRET || '';
    }
    static getDatabaseConfig() {
        if (process.env.POSTGRES_URL) {
            return {
                uri: process.env.POSTGRES_URL,
            };
        }
        if (process.env.PGURL && process.env.PGUSERNAME && process.env.PGDATABASE && process.env.PGPASSWORD) {
            return {
                host: process.env.PGURL,
                port: process.env.PGPORT ? parseInt((process.env.PGPORT), 10) : undefined,
                database: process.env.PGDATABASE,
                username: process.env.PGUSERNAME,
                password: process.env.PGPASSWORD,
            };
        }
        return undefined;
    }
    static verifyEnvironment() {
        console.info(chalk_1.default.blueBright('[Info]'), 'Verifying environment');
        if (this.getURL() === '') {
            console.error(chalk_1.default.bgRed('[Error]'), 'URL is not defined in environment variables!');
            throw new Error('Missing process.env.URL');
        }
        if (this.getSession() === '') {
            console.error(chalk_1.default.redBright('[Error]'), 'Session Secret is not defined in environment variables!');
            throw new Error('Missing process.env.SESSION_SECRET');
        }
        if (this.getDatabaseConfig() === undefined) {
            console.error(chalk_1.default.redBright('[Error]'), 'The database configuration in environment variables is not complete!');
            throw new Error('Missing database environment variables');
        }
        return true;
    }
}
exports.default = Environment;
