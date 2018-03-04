import { CategoryService } from '../../controllers/CategoryService';
import { CategoryModel } from '../../models/CategoryModel';
import { CategoryUpdate, CategoryFilter } from '../types/category';
import { Action } from '../../util/Permissions';


const resolvers = {
    Query: {
        categories: async (obj: any, args: { filters?: CategoryFilter },
                           context: any) => {
            if (!context.user || !context.user.can(Action.ViewCategories)) {
                throw new Error('You do not have permission to ' +
                    ' view categories');
            }

            let categories: CategoryModel[];

            if (args.filters && args.filters.category_id) {
                const res = await CategoryService
                    .findById(args.filters.category_id);
                categories = res ? [res] : [];
            } else {
                categories = await CategoryService.find();
            }

            return categories;
        },
    },
    Mutation: {
        createCategory: async (obj: any, args: any, context: any) => {
            if (!context.user || !context.user.can(Action.CreateCategory)) {
                throw new Error('You do not have permission to create' +
                    ' categories');
            }

            let category = undefined;
            category = await CategoryService.create({
                name: args.name,
                is_primary: args.is_primary,
            });
            return category;
        },
        deleteCategory: async (obj: any, args: any, context: any) => {
            if (!context.user || !context.user.can(Action.DeleteCategory)) {
                throw new Error('You do not have permission to delete'
                    + ' categories');
            }

            if (args.category_id) {
                CategoryService.delete(args.category_id);
            } else {
                throw new Error('must specify category_id');
            }
        },
        updateCategory: async (obj: any,
                               args: {
                                   category_id?: number,
                                   update?: CategoryUpdate
                               },
                               context: any) => {

            if (!context.user || !context.user.can(Action.UpdateCategory)) {
                throw new Error('You do not have permission to update' +
                    ' categories');
            }

            const updated =
                await CategoryService.update(args.category_id!,
                    args.update!);
            if (!updated) {
                throw new Error('failed to update category');
            }
            return updated as CategoryModel;

        },
    },
};

export default resolvers;
