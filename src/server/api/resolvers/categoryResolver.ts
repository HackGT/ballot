import { CategoryService } from '../../controllers/CategoryService';
import { ICategoryModel } from '../../models/CategoryModel';
import { CategoryFilter } from '../types/category';


const resolvers = {
    Query: {
        categories: async (obj: any, args: { filters?: CategoryFilter }, context: any) => {
            let users: ICategoryModel[];

            if (args.filters && args.filters.name) {
                const res = await CategoryService.findByName(args.filters.name as string);
                users = res ? [res] : [];
            } else if (args.filters && args.filters.category_id) {
                const res = await CategoryService.findById(args.filters.category_id as number);
                users = res ? [res] : [];
            } else {
                users = await CategoryService.find();
            }
            return users;
        },
    },
    Mutation: {
        createCategory: async (obj: any, args: any, context: any) => {
            let category = undefined;
            if (args.name && args.category_id && args.is_primary) {
                category = await CategoryService.createCategory(args.category_id, args.name, args.is_primary);
            } else {
                throw new Error('must include category_id, name, and is_primary');
            }
            return category;
        },
        addCriteria: async (obj: any, args: any, context: any) => {
            let category = undefined;
            if (args.category_id && args.name && args.rubric && args.min_score && args.max_score) {
                category = await CategoryService.addCriteria(args.category_id,
                    args.name,
                    args.rubric,
                    args.min_score,
                    args.max_score);
            } else {
                throw new Error('must include category_id, name, rubric, min, and max');
            }
            return category;
        },
    },
};

export default resolvers;
