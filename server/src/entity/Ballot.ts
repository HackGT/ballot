import { Column, PrimaryGeneratedColumn, Entity, UpdateDateColumn, CreateDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Project } from './Project';
import { Criteria } from './Criteria';
import { User } from './User';

export enum BallotStatus {
  Pending = 'pending',
  Assigned = 'assigned',
  Submitted = 'submitted',
  Missing = 'missing',
  Busy = 'busy',
  Skipped = 'skipped',
  Started = 'started',
}

@Entity()
export class Ballot {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column('enum', { enum: BallotStatus })
  public status: BallotStatus;

  @ManyToOne(() => Project, (project) => project.ballots, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  public project: Project;

  @ManyToOne(() => Criteria, (criteria) => criteria.ballots)
  public criteria: Criteria;

  @ManyToOne(() => User, (user) => user.ballots)
  public user: User;

  @Column()
  public score: number;

  @CreateDateColumn()
  public createdAt?: number;

  @UpdateDateColumn()
  public updatedAt?: number;
}

export interface BallotClient {
  id: number;
  status: BallotStatus;
  projectID: number;
  criteriaID: number;
  userID: number;
  score: number;
  createdAt: number;
  updatedAt: number;
}

export const convertToClient = (ballots: Ballot[]) => {
  const toReturn: { [ballotID: number]: BallotClient } = {};
  for (const ballot of ballots) {
    const newBallot = {
      id: ballot.id!,
      status: ballot.status,
      projectID: ballot.project.id!,
      criteriaID: ballot.criteria.id!,
      userID: ballot.user.id!,
      score: ballot.score,
      createdAt: ballot.createdAt!,
      updatedAt: ballot.updatedAt!,
    };
    toReturn[ballot.id!] = newBallot;
  }
  return toReturn;
};
