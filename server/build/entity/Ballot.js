"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Project_1 = require("./Project");
const Criteria_1 = require("./Criteria");
const User_1 = require("./User");
var BallotStatus;
(function (BallotStatus) {
    BallotStatus["Pending"] = "pending";
    BallotStatus["Assigned"] = "assigned";
    BallotStatus["Submitted"] = "submitted";
    BallotStatus["Missing"] = "missing";
    BallotStatus["Busy"] = "busy";
    BallotStatus["Skipped"] = "skipped";
    BallotStatus["Started"] = "started";
})(BallotStatus = exports.BallotStatus || (exports.BallotStatus = {}));
let Ballot = class Ballot {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Ballot.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: 'ballot_status',
        type: 'enum',
        enum: BallotStatus,
        default: BallotStatus.Pending,
    }),
    __metadata("design:type", String)
], Ballot.prototype, "status", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Project_1.Project, (project) => project.ballots, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Project_1.Project)
], Ballot.prototype, "project", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Criteria_1.Criteria, (criteria) => criteria.ballots, {
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", Criteria_1.Criteria)
], Ballot.prototype, "criteria", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.ballots),
    __metadata("design:type", User_1.User)
], Ballot.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Ballot.prototype, "score", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Number)
], Ballot.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Number)
], Ballot.prototype, "updatedAt", void 0);
Ballot = __decorate([
    typeorm_1.Entity()
], Ballot);
exports.Ballot = Ballot;
exports.convertToClient = (ballots) => {
    const toReturn = {};
    for (const ballot of ballots) {
        if (ballot.project && ballot.criteria && ballot.user) {
            toReturn[ballot.id] = {
                ...ballot,
                id: ballot.id,
                projectID: ballot.project.id,
                criteriaID: ballot.criteria.id,
                userID: ballot.user.id,
                createdAt: ballot.createdAt,
                updatedAt: ballot.updatedAt,
            };
        }
    }
    return toReturn;
};
