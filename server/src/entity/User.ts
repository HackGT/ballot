import { Entity, Column, PrimaryGeneratedColumn, Unique, UpdateDateColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Ballot } from './Ballot';

export enum UserRole {
  Owner = 'owner',
  Admin = 'admin',
  Judge = 'judge',
  Pending = 'pending',
}

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public email: string;

  @Column()
  public name: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.Pending,
  })
  public role: UserRole;

  @Column({ default: false })
  public isJudging: boolean;

  @Column('character varying', { array: true })
  public tags: string[];

  @Column({
    default: '',
  })
  public company: string;

  @Column()
  public salt: string;

  @Column()
  public hash: string;

  @OneToMany(() => Ballot, (ballot) => ballot.user)
  public ballots?: Ballot[];

  @CreateDateColumn()
  public createdAt?: number;

  @UpdateDateColumn()
  public updatedAt?: number;
}
