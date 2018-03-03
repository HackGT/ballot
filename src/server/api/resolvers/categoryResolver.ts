import { CategoryService } from '../../controllers/CategoryService';
import { CategoryModel } from '../../models/CategoryModel';
import { CategoryUpdate } from '../types/category';


const resolvers = {
    Query: {
        categories: async (obj: any, args: any, context: any) => {
            let users: CategoryModel[];
            users = await CategoryService.find();
            return users;
        },
    },
    Mutation: {
        create: async (obj: any, args: any, context: any) => {
            let category = undefined;
            if (args.name && args.category_id && args.is_primary) {
                category = await CategoryService.create(args.category_id, args.name, args.is_primary);
            } else {
                throw new Error('must include category_id, name, and is_primary');
            }
            return category;
        },
        delete: async (obj: any, args: any, context: any) => {
            if (args.category_id) {
                CategoryService.delete(args.category_id);
            } else {
                throw new Error('must specify category_id');
            }
        },
        update: async (obj: any, args: {category_id?: number, update?: CategoryUpdate},
            context: any) => {
            if (args.category_id && args.update) {
                let updated = await CategoryService.update(args.category_id, args.update);
                if (!updated) {
                    throw new Error('failed to update category');
                }
                return updated as CategoryModel;
            } else {
                throw new Error('must include category_id and update');
            }
        },
    },
};

export default resolvers;
