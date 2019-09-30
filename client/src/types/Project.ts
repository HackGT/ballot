export default interface Project {
  id?: number;
  name: string;
  devpostURL: string;
  expoNumber: number;
  tableGroupID: number;
  tableNumber: number;
  categoryIDs: number[];
  tags: string[];
}

export interface TableGroup {
  id?: number;
  name: string;
  shortcode: string;
  color: string;
}

export interface ProjectState {
  [ id: number ]: Project;
}

export interface TableGroupState {
  [ id: number ]: TableGroup;
}

export const EMPTY_TABLE_GROUP = {
  id: -1,
  name: '',
  shortcode: '',
  color: '',
}
