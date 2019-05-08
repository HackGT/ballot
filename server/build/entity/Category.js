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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Criteria_1 = __importDefault(require("./Criteria"));
var UserClass;
(function (UserClass) {
    UserClass["Pending"] = "Pending";
    UserClass["Judge"] = "Judge";
    UserClass["Admin"] = "Admin";
    UserClass["Owner"] = "Owner";
})(UserClass = exports.UserClass || (exports.UserClass = {}));
let Category = class Category {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Category.prototype, "categoryID", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Category.prototype, "is_default", void 0);
__decorate([
    typeorm_1.OneToMany(type => Criteria_1.default, criteria => criteria.categories),
    __metadata("design:type", Array)
], Category.prototype, "criteria", void 0);
Category = __decorate([
    typeorm_1.Entity()
], Category);
exports.default = Category;
