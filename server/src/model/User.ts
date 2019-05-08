import { Model } from 'objection';
import { Role } from '../config/Permissions';

export default class User extends Model {
    readonly id!: number;
    name: string;
    email: string;
    role: Role;
    tags: string;
    salt: string;
    hash: string;

    static get tableName() {
        return 'users';
    }

    static get idColumn() {
        return 'id';
    }
}
