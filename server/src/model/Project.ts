import { Model } from 'objection';
import Category from './Category';

export default class Project extends Model {
    readonly id!: number;
    name: string;
    devpostURL: string;
    expoNumber: number;
    tableGroup: string;
    tableNumber: number;
    sponsorPrizes: string;
    tags: string;

    static get tableName() {
        return 'projects';
    }

    static get idColumn() {
        return 'id';
    }

    static get relationMappings() {
        return {
            category: {
                relation: Model.ManyToManyRelation,
                modelClass: Category,
                join: {
                    from: 'projects.id',
                    through: {
                        from: 'project-categories.projectID',
                        to: 'project-categories.categoryID',
                    },
                    to: 'categories.id',
                },
            },
        };
    }
}
