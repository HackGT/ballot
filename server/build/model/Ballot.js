"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const Project_1 = __importDefault(require("./Project"));
const Criteria_1 = __importDefault(require("./Criteria"));
const User_1 = __importDefault(require("./User"));
var BallotStatus;
(function (BallotStatus) {
    BallotStatus["Pending"] = "Pending";
    BallotStatus["Assigned"] = "Assigned";
    BallotStatus["Submitted"] = "Submitted";
    BallotStatus["Missing"] = "Missing";
    BallotStatus["Busy"] = "Busy";
    BallotStatus["Skipped"] = "Skipped";
    BallotStatus["Started"] = "Started";
})(BallotStatus = exports.BallotStatus || (exports.BallotStatus = {}));
class Ballot extends objection_1.Model {
    static get tableName() {
        return 'ballots';
    }
    static get idColumn() {
        return 'id';
    }
    static get relationMappings() {
        return {
            project: {
                relation: objection_1.Model.HasOneRelation,
                modelClass: Project_1.default,
                join: {
                    from: 'ballots.projectID',
                    to: 'projects.id',
                },
            },
            criteria: {
                relation: objection_1.Model.HasOneRelation,
                modelClass: Criteria_1.default,
                join: {
                    from: 'ballots.criteriaID',
                    to: 'criteria.id',
                },
            },
            user: {
                relation: objection_1.Model.HasOneRelation,
                modelClass: User_1.default,
                join: {
                    from: 'ballots.userID',
                    to: 'users.id',
                },
            },
        };
    }
}
exports.default = Ballot;
