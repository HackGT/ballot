import { CategoryModel, Categories, CategoryModelWithoutCriteria } from '../models/CategoryModel';
import { Criteria } from '../models/CriteriaModel';
import { Logger } from '../util/Logger';
import * as Promise from 'bluebird';
import { printAndThrowError } from '../util/common';

const logger = Logger('controllers/CategoryService');

export class CategoryService {

    public static find(): Promise<CategoryModel[]> {
        return Categories.findAll({
            include: [{ model: Criteria }],
        }).then((categories) => {
            return categories.map((category) => {
                return {
                    ...category.toJSON(),
                    criteria: category.criteria!.map(
                        (criteria) => criteria.toJSON()),
                };
            });
        }).catch(printAndThrowError('find', logger));
    }

    public static findById(categoryId: number):
        Promise<CategoryModel | undefined> {
        return Categories.findById(categoryId, {
            include: [{ model: Criteria }],
        }).then((category) => {
            return category ? {
                ...category.toJSON(),
                criteria: category.criteria!.map(
                    (criteria) => criteria.toJSON()),
            } : undefined;
        }).catch(printAndThrowError('findById', logger));
    }

    public static create(category: CategoryModelWithoutCriteria):
        Promise<CategoryModel | undefined> {
        return Categories.create(category)
            .then((newCategory) => {
                return {
                    ...newCategory.toJSON(),
                    criteria: [],
                };
            })
            .catch(printAndThrowError('create', logger));
    }

    public static delete(categoryId: number): Promise<void> {
        return Categories.destroy({ where: { category_id: categoryId } })
            .then((num) => {
                if (num === 0) {
                    throw new Error('No rows deleted');
                } else if (num > 1) {
                    throw new Error('More than one row deleted');
                }
            }).catch(printAndThrowError('delete', logger));
    }

    public static update(categoryId: number, category: Partial<CategoryModel>):
        Promise<CategoryModelWithoutCriteria | undefined> {

        return Categories.update(category as CategoryModel,
            { where: { category_id: categoryId }, returning: true })
            .then((val) => {
                const [num, categories] = val;
                if (num === 0) {
                    logger.error('categoryId did not match any categories');
                    return undefined;
                }
                return categories[0]!.toJSON();
            }).catch(printAndThrowError('update', logger));
    }
}
