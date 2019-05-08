"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const Category_1 = __importDefault(require("./Category"));
class Project extends objection_1.Model {
    static get tableName() {
        return 'projects';
    }
    static get idColumn() {
        return 'id';
    }
    static get relationMappings() {
        return {
            category: {
                relation: objection_1.Model.ManyToManyRelation,
                modelClass: Category_1.default,
                join: {
                    from: 'projects.id',
                    through: {
                        from: 'project-categories.projectID',
                        to: 'project-categories.categoryID',
                    },
                    to: 'categories.id',
                },
            },
        };
    }
}
exports.default = Project;
