import { TableGroup, TableGroupState } from '../types/Project';

export const UPDATE_TABLE_GROUP = 'UPDATE_TABLE_GROUP';
export const DELETE_TABLE_GROUP = 'DELETE_TABLE_GROUP';
export const FILL_TABLE_GROUPS = 'FILL_TABLE_GROUPS';

export function updateTableGroup(tableGroup: TableGroup) {
  return { type: UPDATE_TABLE_GROUP, tableGroup };
}

export function deleteTableGroup(tableGroupID: number) {
  return { type: DELETE_TABLE_GROUP, tableGroupID };
}

export function fillTableGroups(tableGroups: TableGroupState) {
  return { type: FILL_TABLE_GROUPS, tableGroups };
}

export default function tableGroups(state: TableGroupState = {}, action: any) {
  switch (action.type) {
    case UPDATE_TABLE_GROUP:
      return {
        ...state,
        [action.tableGroup.id]: action.tableGroup,
      };
    case DELETE_TABLE_GROUP:
      let {[action.tableGroupID]: omit, ...rest} = state;
      return rest;
    case FILL_TABLE_GROUPS:
      return action.tableGroups;
    default:
      return state;
  }
}
