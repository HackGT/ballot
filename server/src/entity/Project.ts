import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { TableGroup } from './TableGroup';
import { Ballot } from './Ballot';
import { Category } from './Category';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public name: string;

  @Column()
  public devpostURL: string;

  @Column()
  public expoNumber: number;

  @Column()
  public roundNumber: number;

  @Column()
  public tableNumber: number;

  @Column('character varying', { array: true })
  public tags: string[];

  @ManyToOne(() => TableGroup, (tableGroup) => tableGroup.projects)
  public tableGroup: TableGroup;

  @ManyToMany(() => Category, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinTable()
  public categories: Category[];

  @OneToMany(() => Ballot, (ballot) => ballot.project, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  public ballots: Ballot[];
}

export interface ProjectClient {
  id?: number;
  name: string;
  devpostURL: string;
  expoNumber: number;
  roundNumber: number;
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
