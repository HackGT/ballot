import * as Sequelize from 'sequelize';
import { Environment, IDatabaseConfigURI, IDatabaseConfig } from '../config/Environment';

const config = Environment.getDatabaseConfig();

if (config === undefined) {
    throw new Error('Expected: PostgresQL Configuration in Environment Variables');
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

if ((config as IDatabaseConfigURI).uri !== undefined) {
    sequelize = new Sequelize((config as IDatabaseConfigURI).uri, sequelizeOptions);
} else {
    sequelizeOptions.host = (config as IDatabaseConfig).host;
    sequelizeOptions.port = (config as IDatabaseConfig).port;

    sequelize = new Sequelize((config as IDatabaseConfig).database,
        (config as IDatabaseConfig).username,
        (config as IDatabaseConfig).password,
        sequelizeOptions);
}
