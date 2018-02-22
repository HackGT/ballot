import * as Sequelize from 'sequelize';
import { Environment } from '../config/Environment';

const config = Environment.getDatabaseConfig();

if (config === undefined) {
    throw new Error('Expected: PostgresQL Configuration in Environment Variables');
}

export const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    operatorsAliases: false,
    define: {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
