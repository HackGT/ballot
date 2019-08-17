import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { Project } from './Project';

@Entity()
export class TableGroup {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  shortcode: string;

  @Column()
  color: string;

  @OneToMany(() => Project, project => project.tableGroup)
  projects: Project[];
}

export interface TableGroupDictionary {
  [tableGroupID: number]: TableGroup;
}

export const EMPTY_TABLE_GROUP_DICTIONARY: TableGroupDictionary = {};
