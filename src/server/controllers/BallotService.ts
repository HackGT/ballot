import { Logger } from '../util/Logger';
import * as Promise from 'bluebird';
import { printAndThrowError } from '../util/common';
import { ProjectModel } from '../models/ProjectModel';

const logger = Logger('controllers/UserService');

export class BallotService {

    public static getNextProject(): ProjectModel | undefined {
        return undefined;
    }

    /*  */
    public static scoreProject(): ProjectModel | undefined {
        return undefined;
    }
}
