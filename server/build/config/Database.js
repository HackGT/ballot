"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const objection_1 = require("objection");
const Environment_1 = __importDefault(require("./Environment"));
const Logger_1 = __importDefault(require("../util/Logger"));
class Database {
    static async connect() {
        if (this.dbConfig === undefined) {
            throw new Error('Expected PostgreSQL configuration in Environment Variables');
        }
        if (this.dbConfig.uri !== undefined) {
            this.db = knex_1.default({
                client: 'postgresql',
                connection: this.dbConfig.uri,
                pool: {
                    min: 0,
                    max: 7,
                },
            });
        }
        else {
            const actualConfig = this.dbConfig;
            this.db = knex_1.default({
                client: 'postgresql',
                connection: {
                    host: actualConfig.host,
                    user: actualConfig.username,
                    password: actualConfig.password,
                    database: actualConfig.database,
                    port: actualConfig.port,
                },
                pool: {
                    min: 0,
                    max: 7,
                },
            });
        }
        objection_1.Model.knex(this.db);
    }
    static getConnection() {
        return this.db;
    }
    static async createSchema() {
        try {
            if (!await this.db.schema.hasTable('users')) {
                await this.db.schema.createTable('users', (table) => {
                    table.increments('id').primary();
                    table.string('email', 256).unique();
                    table.string('name', 256);
                    table.enum('role', ['Pending', 'Judge', 'Admin', 'Owner']);
                    table.text('tags');
                    table.string('salt', 64);
                    table.string('hash', 2556);
                });
            }
            if (!await this.db.schema.hasTable('categories')) {
                await this.db.schema.createTable('categories', (table) => {
                    table.increments('id').primary();
                    table.string('name', 256);
                    table.boolean('isDefault');
                });
            }
            if (!await this.db.schema.hasTable('criteria')) {
                await this.db.schema.createTable('criteria', (table) => {
                    table.increments('id').primary();
                    table.string('name', 64);
                    table.text('rubric');
                    table.integer('minScore');
                    table.integer('maxScore');
                    table.integer('categoryID').references('categories.id');
                });
            }
            if (!await this.db.schema.hasTable('projects')) {
                await this.db.schema.createTable('projects', (table) => {
                    table.increments('id').primary();
                    table.string('name', 512);
                    table.string('devpostURL', 512);
                    table.integer('expoNumber');
                    table.string('tableGroup');
                    table.integer('tableNumber');
                    table.text('sponsorPrizes');
                    table.text('tags');
                });
            }
            if (!await this.db.schema.hasTable('project-categories')) {
                await this.db.schema.createTable('project-categories', (table) => {
                    table.integer('projectID').references('projects.id');
                    table.integer('categoryID').references('categories.id');
                });
            }
            if (!await this.db.schema.hasTable('ballots')) {
                await this.db.schema.createTable('ballots', (table) => {
                    table.increments('id').primary();
                    table.integer('projectID').references('projects.id');
                    table.integer('criteriaID').references('criteria.id');
                    table.integer('userID').references('users.id');
                    table.enum('status', ['Pending', 'Assigned', 'Submitted', 'Missing', 'Busy', 'Skipped', 'Started']);
                    table.integer('score');
                    table.dateTime('submmitedAt');
                });
            }
            if (!await this.db.schema.hasTable('table-groups')) {
                await this.db.schema.createTable('table-groups', (table) => {
                    table.increments('id').primary();
                    table.string('name');
                    table.string('shortcode');
                    table.string('color');
                });
            }
        }
        catch (err) {
            Logger_1.default.error('Error encountered when creating tables');
        }
    }
}
Database.dbConfig = Environment_1.default.getDatabaseConfig();
exports.default = Database;
