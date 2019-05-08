import { Model } from 'objection';
import Project from './Project';
import Criteria from './Criteria';
import User from './User';

export enum BallotStatus {
    Pending = 'Pending',
    Assigned = 'Assigned',
    Submitted = 'Submitted',
    Missing = 'Missing',
    Busy = 'Busy',
    Skipped = 'Skipped',
    Started = 'Started',
}

export default class Ballot extends Model {
    readonly id!: number;
    projectID: number;
    criteriaID: number;
    userID: number;
    status: BallotStatus;
    score: number;
    submittedAt: Date;

    static get tableName() {
        return 'ballots';
    }

    static get idColumn() {
        return 'id';
    }

    static get relationMappings() {
        return {
            project: {
                relation: Model.HasOneRelation,
                modelClass: Project,
                join: {
                    from: 'ballots.projectID',
                    to: 'projects.id',
                },
            },
            criteria: {
                relation: Model.HasOneRelation,
                modelClass: Criteria,
                join: {
                    from: 'ballots.criteriaID',
                    to: 'criteria.id',
                },
            },
            user: {
                relation: Model.HasOneRelation,
                modelClass: User,
                join: {
                    from: 'ballots.userID',
                    to: 'users.id',
                },
            },
        };
    }
}
