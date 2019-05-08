"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const Criteria_1 = __importDefault(require("./Criteria"));
class Category extends objection_1.Model {
    static get tableName() {
        return 'categories';
    }
    static get idColumn() {
        return 'id';
    }
    static get relationMappings() {
        return {
            criteria: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: Criteria_1.default,
                join: {
                    from: 'categories.id',
                    to: 'criteria.categoryID',
                },
            },
        };
    }
}
exports.default = Category;
