"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class TableGroup extends objection_1.Model {
    static get tableName() {
        return 'table-groups';
    }
    static get idColumn() {
        return 'id';
    }
}
exports.default = TableGroup;
