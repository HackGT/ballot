import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { TableGroup } from './TableGroup';
import { Ballot } from './Ballot';
import { Category } from './Category';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  devpostURL: string;

  @Column()
  expoNumber: number;

  @Column()
  tableNumber: number;

  @Column('character varying', { array: true })
  tags: string[];

  @ManyToOne(() => TableGroup, tableGroup => tableGroup.projects)
  tableGroup: TableGroup;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Ballot, ballot => ballot.user)
  ballots: Ballot[];
}

export interface ProjectClient {
  id?: number;
  name: string;
  devpostURL: string;
  expoNumber: number;
  tableGroupID: number;
  tableNumber: number;
  categoryIDs: number[];
  tags: string[];
}

export interface ProjectClientState {
  [projectID: number]: ProjectClient;
}

export interface ProjectDictionary {
  [projectID: number]: Project;
}

export const EMPTY_PROJECT_DICTIONARY: ProjectDictionary = {};
