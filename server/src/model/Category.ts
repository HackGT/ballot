import { Model } from 'objection';
import Criteria from './Criteria';

export default class Category extends Model {
    readonly id!: number;
    name: string;
    isDefault: boolean;

    static get tableName() {
        return 'categories';
    }

    static get idColumn() {
        return 'id';
    }

    static get relationMappings() {
        return {
            criteria: {
                relation: Model.HasManyRelation,
                modelClass: Criteria,
                join: {
                    from: 'categories.id',
                    to: 'criteria.categoryID',
                },
            },
        };
    }
}
