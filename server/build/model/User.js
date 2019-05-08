"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class User extends objection_1.Model {
    static get tableName() {
        return 'users';
    }
    static get idColumn() {
        return 'id';
    }
}
exports.default = User;
