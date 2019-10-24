"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = require("../entity/Category");
const Criteria_1 = require("../entity/Criteria");
const typeorm_1 = require("typeorm");
class CategoryController {
    static async getAllCategories() {
        const categoryRepository = typeorm_1.getRepository(Category_1.Category);
        const allCategories = await categoryRepository.find();
        return this.convertToClientCategories(allCategories, false);
    }
    static async getAllCategoriesWithCriteria() {
        const categoryRepository = typeorm_1.getRepository(Category_1.Category);
        const allCategories = await categoryRepository.find({
            relations: ['criteria'],
        });
        return this.convertToClientCategories(allCategories, true);
    }
    static async updateCategory(categories) {
        const categoryRepository = typeorm_1.getRepository(Category_1.Category);
        const [newCategories] = await Promise.all([
            await categoryRepository.save(categories),
            await typeorm_1.getRepository(Criteria_1.Criteria).delete({
                category: typeorm_1.IsNull(),
            }),
        ]);
        const result = await categoryRepository.find({
            where: newCategories,
            relations: ['criteria'],
        });
        if (result) {
            this.updateDictionaries();
            return this.convertToClientCategories(result, true);
        }
        throw new Error('Could not find updated category after database update.');
    }
    static async deleteCategory(categoryID) {
        const categoryRepository = typeorm_1.getRepository(Category_1.Category);
        const result = await categoryRepository.delete(categoryID);
        this.updateDictionaries();
        return result;
    }
    static async deleteGeneratedCategories() {
        const categoryRepository = typeorm_1.getRepository(Category_1.Category);
        const result = await categoryRepository.delete({
            generated: true,
        });
        this.updateDictionaries();
        return result;
    }
    static async getCategoryCompanies() {
        const categoryRepository = typeorm_1.getRepository(Category_1.Category);
        const result = await categoryRepository
            .createQueryBuilder('categories')
            .select('DISTINCT company', 'company')
            .getRawMany();
        return result.map((value) => value.company).sort();
    }
    static async updateDictionaries() {
        const allCategories = await typeorm_1.getRepository(Category_1.Category).find();
        this.categoryDictionary = allCategories.reduce((dict, category) => {
            dict[category.id] = category;
            return dict;
        }, Category_1.EMPTY_CATEGORY_DICTIONARY);
    }
    static convertToClientCategories(categories, withCriteria) {
        const categoriesToReturn = {};
        for (const category of categories) {
            categoriesToReturn[category.id] = {
                ...category,
                criteria: withCriteria ? this.convertToClientCriteria(category.criteria) : {},
            };
        }
        return categoriesToReturn;
    }
    static convertToClientCriteria(criterias) {
        const criteriaToReturn = {};
        for (const criteria of criterias) {
            criteriaToReturn[criteria.id] = criteria;
        }
        return criteriaToReturn;
    }
}
CategoryController.categoryDictionary = Category_1.EMPTY_CATEGORY_DICTIONARY;
exports.default = CategoryController;
