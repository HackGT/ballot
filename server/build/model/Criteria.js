"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const Category_1 = __importDefault(require("./Category"));
class Criteria extends objection_1.Model {
    static get tableName() {
        return 'criteria';
    }
    static get idColumn() {
        return 'id';
    }
    static get relationMappings() {
        return {
            categories: {
                relation: objection_1.Model.HasOneRelation,
                modelClass: Category_1.default,
                join: {
                    from: 'criteria.categoryID',
                    to: 'categories.id',
                },
            },
        };
    }
}
exports.default = Criteria;
