import { Model } from 'objection';

export default class TableGroup extends Model {
    readonly id!: number;
    name: string;
    shortcode: string;
    color: string;

    static get tableName() {
        return 'table-groups';
    }

    static get idColumn() {
        return 'id';
    }
}
