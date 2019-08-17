import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { Criteria } from './Criteria';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  isDefault: boolean;

  @Column()
  generated: boolean;

  @Column("text")
  description: string;

  @OneToMany(() => Criteria, criteria => criteria.category, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  criteria: Criteria[];
}

export interface CategoryDictionary {
  [categoryID: number]: Category;
}

export const EMPTY_CATEGORY_DICTIONARY: CategoryDictionary = {};
