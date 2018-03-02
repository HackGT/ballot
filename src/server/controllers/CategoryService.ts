import { ICategoryModel, Categories } from '../models/CategoryModel';
import { ICriteriaModel, Criteria } from '../models/CriteriaModel';
import { Logger } from '../util/Logger';
import * as Promise from 'bluebird';
import { printAndThrowError } from '../util/common';

const logger = Logger('controllers/CategoryService');

export class CategoryService {

    public static find(): Promise<ICategoryModel[]> {
        return Categories.sync()
            .then(() => Categories.findAll())
            .then((categories) => categories.map((category) => category.toJSON()))
            .catch(printAndThrowError('find', logger));
    }

    public static findById(categoryId: number): Promise<ICategoryModel | undefined> {
        return Categories.sync()
            .then(() => Categories.findById(categoryId))
            .then((category) => category ? category.toJSON() : undefined)
            .catch(printAndThrowError('findById', logger));
    }

    public static create(categoryId: number, name: string, isPrimary: boolean): Promise<ICategoryModel | undefined> {
        return Categories.sync()
            .then(() => Categories.findOrCreate({ where: { category_id: categoryId, name, is_primary: isPrimary } }))
            .spread((category, created) => {
                if (!created) {
                    throw new Error('Category Already Exists!');
                } else {
                    return category as ICategoryModel;
                }
            })
            .catch(printAndThrowError('findByName', logger));
    }

    public static addCriteria(categoryId: number, name: string, rubric: string,
                              minScore: number, maxScore: number): Promise<ICategoryModel | undefined> {
        return Criteria.sync()
            .then(() => Criteria.findOrCreate({ where: { category_id: categoryId, name, rubric, min_score: minScore, max_score: maxScore } }))
            .spread((criteria, created) => {
                if (!created) {
                    throw new Error('Criteria Already Exists!');
                } else {
                    return CategoryService.findById((criteria as ICriteriaModel).category_id);
                }
            })
            .catch(printAndThrowError('addCriteria', logger));
    }

    public static getCriteria(categoryId: number): Promise<ICriteriaModel[]> {
        return Criteria.sync()
            .then(() => Criteria.findAll({ where: { category_id: categoryId } }))
            .then((criteria) => criteria.map((criterion) => criterion.toJSON()))
            .catch(printAndThrowError('getCriteria', logger));
    }
}
