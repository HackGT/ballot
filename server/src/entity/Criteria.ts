import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './Category';
import { Ballot } from './Ballot';

@Entity()
export class Criteria {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name: string;

    @Column("text")
    rubric: string;

    @Column()
    minScore: number;

    @Column()
    maxScore: number;

    @OneToMany(() => Ballot, ballot => ballot.user)
    ballots: Ballot[];

    @ManyToOne(() => Category, category => category.criteria, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    category: Category;
}
