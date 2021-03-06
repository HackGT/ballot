import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { Criteria } from './Criteria';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public name: string;

  @Column()
  public isDefault: boolean;

  @Column({ default: false })
  public isHidden: boolean;

  @Column()
  public generated: boolean;

  @Column('text')
  public description: string;

  @Column({
    default: '',
  })
  public company: string;

  @OneToMany(() => Criteria, (criteria) => criteria.category, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  public criteria: Criteria[];
}

export interface CategoryDictionary {
  [categoryID: number]: Category;
}

export const EMPTY_CATEGORY_DICTIONARY: CategoryDictionary = {};
