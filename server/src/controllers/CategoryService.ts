import { CategoryModel, Categories, CategoryModelWithoutCriteria } from '../models/CategoryModel';
import { Criteria } from '../models/CriteriaModel';
import { Logger } from '../util/Logger';
import * as BPromise from 'bluebird';
import { printAndThrowError } from '../util/common';
import { dataStore } from '../store/DataStore';

const logger = Logger('controllers/CategoryService');

export class CategoryService {

    public static find(): BPromise<CategoryModel[]> {
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

    public static findById(categoryID: number):
        BPromise<CategoryModel | undefined> {
        return Categories.findById(categoryID, {
            include: [{ model: Criteria }],
        }).then((category) => {
            return category ? {
                ...category.toJSON(),
                criteria: category.criteria!.map(
                    (criteria) => criteria.toJSON()),
            } : undefined;
        }).catch(printAndThrowError('findById', logger));
    }

    public static async create(category: CategoryModelWithoutCriteria):
        Promise<CategoryModel | undefined> {
        const newCategory = await Categories.create(category, {
            returning: true,
        });

        const newCategoryJSON = newCategory.toJSON();
        const newCategoryWithCriteria: CategoryModel = {
            ...newCategoryJSON,
            criteria: [],
        };

        console.log(newCategoryWithCriteria);

        dataStore.categories[newCategoryJSON.category_id!] = newCategoryWithCriteria;

        return newCategoryWithCriteria;
    }

    public static async delete(categoryID: number): Promise<void> {
        const criteriaToDelete = await Criteria.findAll({
            where: { category_id: categoryID }
        });

        if (criteriaToDelete) {
            for (const criteria of criteriaToDelete) {
                const criteriaJSON = criteria.toJSON();
                delete dataStore.criteria[criteriaJSON.criteria_id!];
            }
        }

        await Criteria.destroy({ where: { category_id: categoryID } });

        delete dataStore.categories[categoryID];

        return Categories.destroy({ where: { category_id: categoryID } })
            .then((num) => {
                if (num === 0) {
                    throw new Error('No rows deleted');
                } else if (num > 1) {
                    throw new Error('More than one row deleted');
                }
            }).catch(printAndThrowError('delete', logger));
    }

    public static update(categoryID: number, category: Partial<CategoryModel>):
        BPromise<CategoryModelWithoutCriteria | undefined> {

        if (dataStore.categories[categoryID]) {
            dataStore.categories[categoryID] = {
                ...dataStore.categories[categoryID],
                ...category,
            };
        }

        dataStore.fetchProjects();

        return Categories.update(category as CategoryModel,
            { where: { category_id: categoryID }, returning: true })
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
