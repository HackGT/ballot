import { getRepository, Not, In } from 'typeorm';
import { TableGroup, EMPTY_TABLE_GROUP_DICTIONARY } from '../entity/TableGroup';

class TableGroupController {
  public static tableGroupDictionary = EMPTY_TABLE_GROUP_DICTIONARY;
  public static async getAllTableGroups() {
    const tableGroupRepository = getRepository(TableGroup);
    const allTableGroups = await tableGroupRepository.find();
    await this.updateDictionaries();
    return this.convertToClient(allTableGroups);
  }

  public static async updateTableGroups(tableGroups: TableGroup[]) {
    const tableGroupRepository = getRepository(TableGroup);
    await tableGroupRepository.delete({
      id: Not(In(tableGroups.map((group) => group.id!))),
    });
    const result = await tableGroupRepository.save(tableGroups);
    await this.updateDictionaries();
    if (result) {
      return this.convertToClient(result);
    }

    throw new Error('Some error occured');
  }

  public static convertToClient(tableGroups: TableGroup[]) {
    const toReturn: { [tableGroupID: number]: any } = {};
    for (const group of tableGroups) {
      toReturn[group.id!] = group;
    }
    return toReturn;
  }

  private static async updateDictionaries() {
    const tableGroupRepository = getRepository(TableGroup);
    const allTableGroups = await tableGroupRepository.find();
    this.tableGroupDictionary = allTableGroups.reduce((dict, tableGroup) => {
      dict[tableGroup.id!] = tableGroup;
      return dict;
    }, EMPTY_TABLE_GROUP_DICTIONARY);
  }
}

export default TableGroupController;
