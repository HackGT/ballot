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
    }

    public static create(criterion: CriteriaModel):
    Promise<CriteriaModel | undefined> {
        return Criteria.create(criterion)
            .then((newCriterion) => newCriterion.toJSON())
            .catch(printAndThrowError('create', logger));
    }

    public static update(criteriaId: number, criteria: Partial<CriteriaModel>):
    Promise<CriteriaModel | undefined> {

        return Criteria.update(criteria as CriteriaModel,
                { where: { criteria_id : criteriaId }, returning: true })
            .then((val) => {
                const [num, updatedCriteria] = val;
                if (num === 0) {
                    logger.error('criteriaId did not match any criteria');
                    return undefined;
                }
                return updatedCriteria[0]!.toJSON();
            }).catch(printAndThrowError('update', logger));
    }
}
