import { Category, CategoryDictionary, EMPTY_CATEGORY_DICTIONARY } from '../entity/Category';
import { Criteria } from '../entity/Criteria';
import { getRepository, IsNull, In } from 'typeorm';

class CategoryController {
  public static categoryDictionary = EMPTY_CATEGORY_DICTIONARY;

  public static async getAllCategories() {
    const categoryRepository = getRepository(Category);
    const allCategories = await categoryRepository.find();
    return this.convertToClientCategories(allCategories, false);
  }

  public static async getAllCategoriesWithCriteria() {
    const categoryRepository = getRepository(Category);
    const allCategories = await categoryRepository.find({
      relations: ['criteria'],
    });
    return this.convertToClientCategories(allCategories, true);
  }

  public static async updateCategory(categories: Category[]) {
    const categoryRepository = getRepository(Category);
    const [newCategories] = await Promise.all([
      await categoryRepository.save(categories),
      await getRepository(Criteria).delete({
        category: IsNull(),
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

  public static async deleteCategory(categoryID: number) {
    const categoryRepository = getRepository(Category);
    const result = await categoryRepository.delete(categoryID);
    this.updateDictionaries();
    return result;
  }

  public static async deleteGeneratedCategories() {
    const categoryRepository = getRepository(Category);
    const result = await categoryRepository.delete({
      generated: true,
    });
    this.updateDictionaries();
    return result;
  }

  private static async updateDictionaries() {
    const allCategories = await getRepository(Category).find();
    this.categoryDictionary = allCategories.reduce((dict, category) => {
      dict[category.id!] = category;
      return dict;
    }, EMPTY_CATEGORY_DICTIONARY);
  }

  private static convertToClientCategories(categories: Category[], withCriteria: boolean) {
    const categoriesToReturn: { [categoryID: number]: any } = {};
    for (const category of categories) {
      categoriesToReturn[category.id!] = {
        ...category,
        criteria: withCriteria ? this.convertToClientCriteria(category.criteria) : {},
      };
    }
    return categoriesToReturn;
  }

  private static convertToClientCriteria(criterias: Criteria[]) {
    const criteriaToReturn: { [criteriaID: number]: any } = {};
    for (const criteria of criterias) {
      criteriaToReturn[criteria.id!] = criteria;
    }
    return criteriaToReturn;
  }
}

export default CategoryController;
