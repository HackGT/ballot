import Environment, { DatabaseConfig } from './Environment';
import { MongoClient, Db } from 'mongodb';
import assert from 'assert';
import Logger from '../util/Logger';

class Database {
    private static dbConfig = Environment.getDatabaseConfig();
    private static client: MongoClient;
    private static db: Db;

    public static async connect() {
        if (this.dbConfig) {
            const url = `mongodb://${this.dbConfig.url}:${this.dbConfig.port}`
            const dbName = this.dbConfig.name;

            this.client = new MongoClient(url, {
                useNewUrlParser: true,
            });

            this.client.connect((err) => {
                assert.equal(null, err);
                Logger.info("Database Connected");

                this.db = this.client.db(dbName);
            });
        }
    }

    public static getClient() {
        return this.client;
    }

    public static getDatabase() {
        return this.db;
    }
}

export default Database;
