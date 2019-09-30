import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { Project } from './Project';

@Entity()
export class TableGroup {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public name: string;

  @Column()
  public shortcode: string;

  @Column()
  public color: string;

  @OneToMany(() => Project, (project) => project.tableGroup, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  public projects: Project[];
}

export interface TableGroupDictionary {
  [tableGroupID: number]: TableGroup;
}

export const EMPTY_TABLE_GROUP_DICTIONARY: TableGroupDictionary = {};
