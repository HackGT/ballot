import { CategoryModel, Categories } from '../models/CategoryModel';
import { CriteriaModel, Criteria } from '../models/CriteriaModel';
import { Logger } from '../util/Logger';
import * as Promise from 'bluebird';
import { printAndThrowError } from '../util/common';

const logger = Logger('controllers/CategoryService');

export class CategoryService {

    public static find(): Promise<CategoryModel[]> {
        return Categories.findAll()
            .then((categories) => categories.map((category) => category.toJSON()))
            .catch(printAndThrowError('find', logger));
    }

    public static findById(categoryId: number): Promise<CategoryModel | undefined> {
        return Categories.findById(categoryId)
            .then((category) => category ? category.toJSON() : undefined)
            .catch(printAndThrowError('findById', logger));
    }

    public static create(categoryId: number, name: string, isPrimary: boolean): Promise<CategoryModel | undefined> {
        return Categories.findOrCreate({ where: { category_id: categoryId, name, is_primary: isPrimary } })
            .spread((category, created) => {
                if (!created) {
                    throw new Error('Category Already Exists!');
                } else {
                    return category as CategoryModel;
                }
            })
            .catch(printAndThrowError('create', logger));
    }

    public static delete(categoryId: number): Promise<void> {
        return Categories.destroy({ where: { category_id: categoryId} })
            .then((num) => {
                if (num === 0) {
                    throw new Error('No rows deleted');
                } else if (num > 1) {
                    throw new Error('More than one row deleted');
                }
            }).catch(printAndThrowError('delete', logger));
    }

    public static update(categoryId: number,
        category: Partial<CategoryModel>): Promise<CategoryModel | undefined> {

        return Categories.update(category as CategoryModel,
                { where: { category_id : categoryId }, returning: true })
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
