import { Entity, Column, PrimaryGeneratedColumn, Unique, UpdateDateColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Ballot } from './Ballot';

export enum UserRole {
    Owner = 'owner',
    Admin = 'admin',
    Judge = 'judge',
    Pending = 'pending',
}

@Entity()
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column('enum')
    role: UserRole;

    @Column('character varying', { array: true })
    tags: string[];

    @Column()
    salt: string;

    @Column()
    hash: string;

    @OneToMany(() => Ballot, ballot => ballot.user)
    ballots?: Ballot[];

    @CreateDateColumn()
    createdAt?: number;

    @UpdateDateColumn()
    updatedAt?: number;
}
