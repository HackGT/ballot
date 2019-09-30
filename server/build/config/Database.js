"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_1 = __importDefault(require("./Environment"));
const typeorm_1 = require("typeorm");
const commonConnectionOptions = {
    entities: [
        __dirname + '/../entity/*.js',
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
                ...commonConnectionOptions,
            });
        }
        else {
            const config = this.dbConfig;
            this.connectionObject = {
                user: config.username,
                password: config.password,
                host: config.url,
                port: config.port,
                database: config.database,
            };
            await typeorm_1.createConnection({
                type: 'postgres',
                host: config.url,
                port: config.port,
                username: config.username,
                password: config.password,
                database: config.database,
                ...commonConnectionOptions,
            });
        }
        const tableExistsResult = await typeorm_1.getManager().query(`SELECT to_regclass('public.session');`);
        console.log('create result', tableExistsResult);
        if (!tableExistsResult[0].to_regclass) {
            await typeorm_1.getManager().query(`CREATE TABLE "session" (
                "sid" varchar NOT NULL COLLATE "default",
                  "sess" json NOT NULL,
                  "expire" timestamp(6) NOT NULL
              )
              WITH (OIDS=FALSE);
              ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
            `);
        }
    }
    static getConnection() {
        return typeorm_1.getConnection();
    }
    static getConnectionObject() {
        return this.connectionObject;
    }
}
Database.connectionObject = {};
Database.dbConfig = Environment_1.default.getDatabaseConfig();
exports.default = Database;
