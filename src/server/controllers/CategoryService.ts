import { ICategoryModel, Categories } from '../models/CategoryModel';
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

    public static findById(category_id: number): Promise<ICategoryModel | undefined> {
        return Categories.sync()
            .then(() => Categories.findById(category_id))
            .then((category) => category ? category.toJSON() : undefined)
            .catch(printAndThrowError('findById', logger));
    }

    public static findByName(name: string): Promise<ICategoryModel | undefined> {
        return Categories.sync()
            .then(() => Categories.findOne({ where: { name }}))
            .then((category) => category ? category.toJSON() : undefined)
            .catch(printAndThrowError('findByName', logger));
    }

    public static createCategory(category_id: number, name: string, is_primary: boolean): Promise<ICategoryModel | undefined> {
        return Categories.sync()
            .then(() => Categories.findOrCreate({ where: { category_id, name, is_primary}}))
            .spread((category, created) => { 
                if (!created) { throw new Error("Category Already Exists!")}
                else { return category as ICategoryModel}})
            .catch(printAndThrowError('findByName', logger));
    }


}
