import { Model } from 'objection';
import Category from './Category';

export default class Criteria extends Model {
    readonly id!: number;
    name: string;
    rubric: string;
    minScore: number;
    maxScore: number;
    categoryID: number;

    static get tableName() {
        return 'criteria';
    }

    static get idColumn() {
        return 'id';
    }

    static get relationMappings() {
        return {
            categories: {
                relation: Model.HasOneRelation,
                modelClass: Category,
                join: {
                    from: 'criteria.categoryID',
                    to: 'categories.id',
                },
            },
        };
    }
}
