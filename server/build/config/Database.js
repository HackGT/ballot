"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_1 = __importDefault(require("./Environment"));
const mongodb_1 = require("mongodb");
const assert_1 = __importDefault(require("assert"));
const Logger_1 = __importDefault(require("../util/Logger"));
class Database {
    static async connect() {
        if (this.dbConfig) {
            const url = `mongodb://${this.dbConfig.url}:${this.dbConfig.port}`;
            const dbName = this.dbConfig.name;
            this.client = new mongodb_1.MongoClient(url, {
                useNewUrlParser: true,
            });
            this.client.connect((err) => {
                assert_1.default.equal(null, err);
                Logger_1.default.info("Database Connected");
                this.db = this.client.db(dbName);
            });
        }
    }
    static getClient() {
        return this.client;
    }
    static getDatabase() {
        return this.db;
    }
}
Database.dbConfig = Environment_1.default.getDatabaseConfig();
exports.default = Database;
