"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_1 = __importDefault(require("./Environment"));
const typeorm_1 = require("typeorm");
const commonConnectionOptions = {
    entities: [
        __dirname + '/../entity/*.js'
    ],
    synchronize: !Environment_1.default.isProduction(),
    logging: false,
};
class Database {
    static async connect() {
        if (this.dbConfig === undefined) {
            throw new Error('Expected PostgreSQL configuration in Environemnt Variables');
        }
        if (this.dbConfig.uri !== undefined) {
            await typeorm_1.createConnection({
                type: 'postgres',
                url: this.dbConfig.uri,
                ...commonConnectionOptions
            });
        }
        else {
            const config = this.dbConfig;
            await typeorm_1.createConnection({
                type: 'postgres',
                host: config.url,
                port: config.port,
                username: config.username,
                password: config.password,
                database: config.database,
                ...commonConnectionOptions
            });
        }
    }
    static getConnection() {
        return typeorm_1.getConnection();
    }
}
Database.dbConfig = Environment_1.default.getDatabaseConfig();
exports.default = Database;
