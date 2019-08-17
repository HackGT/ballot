import Environment, { DatabaseConfig, DatabaseConfigURI } from './Environment';
import { createConnection, getConnection } from 'typeorm';

const commonConnectionOptions = {
    entities: [
        __dirname + '/../entity/*.js'
    ],
    synchronize: !Environment.isProduction(),
    logging: false,
};

class Database {
    private static dbConfig = Environment.getDatabaseConfig();

    public static async connect() {
        if (this.dbConfig === undefined) {
            throw new Error('Expected PostgreSQL configuration in Environemnt Variables');
        }

        if ((this.dbConfig as DatabaseConfigURI).uri !== undefined) {
            await createConnection({
                type: 'postgres',
                url: (this.dbConfig as DatabaseConfigURI).uri,
                ...commonConnectionOptions
            });
        } else {
            const config = this.dbConfig as DatabaseConfig;
            await createConnection({
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

    public static getConnection() {
        return getConnection();
    }
}

export default Database;
