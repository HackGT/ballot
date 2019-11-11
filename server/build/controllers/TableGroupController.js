"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const TableGroup_1 = require("../entity/TableGroup");
class TableGroupController {
    static async getAllTableGroups() {
        const tableGroupRepository = typeorm_1.getRepository(TableGroup_1.TableGroup);
        const allTableGroups = await tableGroupRepository.find();
        await this.updateDictionaries();
        return this.convertToClient(allTableGroups);
    }
    static async updateTableGroups(tableGroups) {
        const tableGroupRepository = typeorm_1.getRepository(TableGroup_1.TableGroup);
        await tableGroupRepository.delete({
            id: typeorm_1.Not(typeorm_1.In(tableGroups.map((group) => group.id))),
        });
        const result = await tableGroupRepository.save(tableGroups);
        await this.updateDictionaries();
        if (result) {
            return this.convertToClient(result);
        }
        throw new Error('Some error occured');
    }
    static convertToClient(tableGroups) {
        const toReturn = {};
        for (const group of tableGroups) {
            toReturn[group.id] = group;
        }
        return toReturn;
    }
    static async updateDictionaries() {
        const tableGroupRepository = typeorm_1.getRepository(TableGroup_1.TableGroup);
        const allTableGroups = await tableGroupRepository.find();
        this.tableGroupDictionary = allTableGroups.reduce((dict, tableGroup) => {
            dict[tableGroup.id] = tableGroup;
            return dict;
        }, TableGroup_1.EMPTY_TABLE_GROUP_DICTIONARY);
    }
}
TableGroupController.tableGroupDictionary = TableGroup_1.EMPTY_TABLE_GROUP_DICTIONARY;
exports.default = TableGroupController;
