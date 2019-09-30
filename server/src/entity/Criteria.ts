import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './Category';
import { Ballot } from './Ballot';

@Entity()
export class Criteria {
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    public name: string;

    @Column('text')
    public rubric: string;

    @Column()
    public minScore: number;

    @Column()
    public maxScore: number;

    @OneToMany(() => Ballot, (ballot) => ballot.user)
    public ballots: Ballot[];

    @ManyToOne(() => Category, (category) => category.criteria, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    public category: Category;
}
