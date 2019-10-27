import Environment, { DatabaseConfig, DatabaseConfigURI } from './Environment';
import { createConnection, getConnection, getManager } from 'typeorm';

const commonConnectionOptions = {
    entities: [
        __dirname + '/../entity/*.js',
    ],
    synchronize: !Environment.isProduction(),
    logging: false,
    ssl: false,
};

class Database {
    private static connectionObject = {};

    public static async connect() {
        if (this.dbConfig === undefined) {
            throw new Error('Expected PostgreSQL configuration in Environment Variables');
        }

        if ((this.dbConfig as DatabaseConfigURI).uri !== undefined) {
            await createConnection({
                type: 'postgres',
                url: (this.dbConfig as DatabaseConfigURI).uri,
                extra: {
                    ssl: false,
                },
                ...commonConnectionOptions,
            });
        } else {
            console.log(1);
            const config = this.dbConfig as DatabaseConfig;
            this.connectionObject = {
                user: config.username,
                password: config.password,
                host: config.url,
                port: config.port,
                database: config.database,
            };
            try {
                await createConnection({
                    type: 'postgres',
                    host: config.url,
                    port: config.port,
                    username: config.username,
                    password: config.password,
                    database: config.database,
                    ...commonConnectionOptions,
                });
            } catch (err) {
                throw new Error(err);
            }
        }
        console.log('here');
        const tableExistsResult = await getManager().query(`SELECT to_regclass('public.session');`);
        console.log('create result', tableExistsResult);

        if (!tableExistsResult[0].to_regclass) {
            await getManager().query(`CREATE TABLE "session" (
                "sid" varchar NOT NULL COLLATE "default",
                  "sess" json NOT NULL,
                  "expire" timestamp(6) NOT NULL
              )
              WITH (OIDS=FALSE);
              ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
            `);
        }
    }

    public static getConnection() {
        return getConnection();
    }

    public static getConnectionObject() {
        return this.connectionObject;
    }

    private static dbConfig = Environment.getDatabaseConfig();
}

export default Database;
