import { Column, PrimaryGeneratedColumn, Entity, UpdateDateColumn, CreateDateColumn, ManyToOne } from 'typeorm';
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
    id?: number;

    @Column('enum', { enum: BallotStatus })
    status: BallotStatus;

    @ManyToOne(() => Project, project => project.ballots)
    project: Project;

    @ManyToOne(() => Criteria, criteria => criteria.ballots)
    criteria: Criteria;

    @ManyToOne(() => User, user => user.ballots)
    user: User;

    @Column()
    score: number;

    @CreateDateColumn()
    createdAt?: number;

    @UpdateDateColumn()
    updatedAt?: number;
}
