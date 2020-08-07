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

  @Column({
    name: 'ballot_status',
    type: 'enum',
    enum: BallotStatus,
    default: BallotStatus.Pending,
  })
  public status: BallotStatus;

  @ManyToOne(() => Project, (project) => project.ballots, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  public project: Project;

  @ManyToOne(() => Criteria, (criteria) => criteria.ballots, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  public criteria: Criteria;

  @ManyToOne(() => User, (user) => user.ballots)
  public user: User;

  @Column()
  public score: number;

  @Column()
  public roundNumber: number;

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
  roundNumber: number;
  createdAt: number;
  updatedAt: number;
}

export const convertToClient = (ballots: Ballot[]) => {
  // console.log(ballots);
  const toReturn: { [ballotID: number]: BallotClient } = {};
  for (const ballot of ballots) {
    if (ballot.project && ballot.criteria && ballot.user) {
      toReturn[ballot.id!] = {
        ...ballot,
        id: ballot.id!,
        projectID: ballot.project.id!,
        criteriaID: ballot.criteria.id!,
        userID: ballot.user.id!,
        createdAt: ballot.createdAt!,
        updatedAt: ballot.updatedAt!,
      };
    }
  }
  return toReturn;
};
