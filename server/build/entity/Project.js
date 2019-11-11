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
const TableGroup_1 = require("./TableGroup");
const Ballot_1 = require("./Ballot");
const Category_1 = require("./Category");
let Project = class Project {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Project.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Project.prototype, "devpostURL", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Project.prototype, "expoNumber", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Project.prototype, "tableNumber", void 0);
__decorate([
    typeorm_1.Column('character varying', { array: true }),
    __metadata("design:type", Array)
], Project.prototype, "tags", void 0);
__decorate([
    typeorm_1.ManyToOne(() => TableGroup_1.TableGroup, (tableGroup) => tableGroup.projects),
    __metadata("design:type", TableGroup_1.TableGroup)
], Project.prototype, "tableGroup", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Category_1.Category, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Project.prototype, "categories", void 0);
__decorate([
    typeorm_1.OneToMany(() => Ballot_1.Ballot, (ballot) => ballot.project, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Project.prototype, "ballots", void 0);
Project = __decorate([
    typeorm_1.Entity()
], Project);
exports.Project = Project;
exports.EMPTY_PROJECT_DICTIONARY = {};
