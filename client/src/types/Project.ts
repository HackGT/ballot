export default interface Project {
  id?: number;
  name: string;
  devpostURL: string;
  expoNumber: number;
  roundNumber: number;
  tableGroupID: number;
  tableNumber: number;
  roomUrl: string;
  categoryIDs: number[];
  tags: string[];
}

export interface ProjectWithHealth extends Project {
  health: number;
}

export interface TableGroup {
  id?: number;
  name: string;
  shortcode: string;
  color: string;
}

export interface ProjectState {
  [id: number]: Project;
}

export interface TableGroupState {
  [id: number]: TableGroup;
}

export const EMPTY_PROJECT = {
  id: 0,
  name: '',
  devpostURL: '',
  expoNumber: 0,
  roundNumber: 0,
  tableGroupID: 0,
  tableNumber: 0,
  roomUrl: '',
  categoryIDs: [],
  tags: [],
}

export const EMPTY_TABLE_GROUP = {
  id: -1,
  name: '',
  shortcode: '',
  color: '',
}
