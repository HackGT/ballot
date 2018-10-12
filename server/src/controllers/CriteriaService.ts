import { CriteriaModel, Criteria } from '../models/CriteriaModel';
import { Logger } from '../util/Logger';
import * as BPromise from 'bluebird';
import { printAndThrowError } from '../util/common';
import { dataStore } from '../store/DataStore';

const logger = Logger('controllers/CriteriaService');

export class CriteriaService {
    public static find(): BPromise<CriteriaModel[]> {
        return Criteria.findAll()
        .then((criteria) => criteria.map((criterion) => criterion.toJSON()))
        .catch(printAndThrowError('find', logger));
    }

    public static async create(criterion: CriteriaModel): Promise<CriteriaModel | undefined> {
        const newCriteria = await Criteria.create(criterion, {
            returning: true,
        });

        const newCriteriaJSON = newCriteria.toJSON();

        dataStore.criteria[newCriteriaJSON.criteria_id!] = newCriteriaJSON;
        dataStore.categories[newCriteriaJSON.category_id].criteria.push(newCriteriaJSON);

        return newCriteriaJSON;
    }

    public static update(criteriaId: number, criteria: Partial<CriteriaModel>):
    BPromise<CriteriaModel | undefined> {
        if (dataStore.criteria[criteriaId]) {
            dataStore.criteria[criteriaId] = {
                ...dataStore.criteria[criteriaId],
                ...criteria,
            };
        }

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

    public static async delete(criteriaID: number): Promise<void> {
        const criteriaToDelete = await Criteria.find({
            where: { criteria_id: criteriaID }
        });

        if (criteriaToDelete) {
            const criteria = criteriaToDelete.toJSON();
            delete dataStore.criteria[criteria.criteria_id!];
        }

        return Criteria.destroy({ where: { criteria_id: criteriaID } })
            .then((num) => {
                if (num === 0) {
                    throw new Error('No rows deleted');
                } else if (num > 1) {
                    throw new Error('More than one row deleted');
                }
            }).catch(printAndThrowError('delete', logger));
    }
}
