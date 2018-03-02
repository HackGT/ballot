import * as Sequelize from 'sequelize';
import {
    Environment,
    DatabaseConfigURI,
    DatabaseConfig
} from '../config/Environment';

const config = Environment.getDatabaseConfig();

if (config === undefined) {
    throw new Error('Expected: PostgresQL Configuration in Environment ' +
        'Variables');
}

const sequelizeOptions: Sequelize.Options = {
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
    logging: false,
};

export let sequelize: Sequelize.Sequelize;

if ((config as DatabaseConfigURI).uri !== undefined) {
    sequelize = new Sequelize((config as DatabaseConfigURI).uri,
        sequelizeOptions);
} else {
    sequelizeOptions.host = (config as DatabaseConfig).host;
    sequelizeOptions.port = (config as DatabaseConfig).port;

    sequelize = new Sequelize((config as DatabaseConfig).database,
        (config as DatabaseConfig).username,
        (config as DatabaseConfig).password,
        sequelizeOptions);
}
