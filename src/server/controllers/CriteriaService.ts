import { CriteriaModel, Criteria } from '../models/CriteriaModel';
import { Logger } from '../util/Logger';
import * as Promise from 'bluebird';
import { printAndThrowError } from '../util/common';

const logger = Logger('controllers/CriteriaService');

export class CriteriaService {
    public static find(): Promise<CriteriaModel[]> {
        return Criteria.findAll()
        .then((criteria) => criteria.map((criterion) => criterion.toJSON()))
        .catch(printAndThrowError('find', logger));
    ]
}
