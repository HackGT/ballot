import { CategoryService } from '../../controllers/CategoryService';
import { ICategoryModel } from '../../models/CategoryModel';
//import { hashPassword } from '../../util/common';
import { CategoryFilter } from '../types/category';


const resolvers = {
    Query: {
        categories: async (obj: any, args: { filters?: CategoryFilter }, context: any) => {
            //todo error checking?
            
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
        }
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
        } 

        //users: async (obj: any, args: { filters?: UserFilter }, context: any) => {
            //if (args.filters && args.filters.email && args.filters.user_id) {
                //throw new Error('email and user_id are both unique identifiers, use only one');
            //}

            //let users: IUserModel[];

            //if (args.filters && args.filters.email) {
                //const res = await UserService.findByEmail(args.filters.email as string);
                //users = res ? [res] : [];
            //} else if (args.filters && args.filters.user_id) {
                //const res = await UserService.findById(args.filters.user_id as number);
                //users = res ? [res] : [];
            //} else {
                //users = await UserService.find();
            //}

            //return users;
        //},
    },

    //Mutation: {
        //changeName: async (obj: any, args: any, context: any) => {
            //const user = await UserService.update(args.id, { name: args.newName });
            //return user;
        //},
        //changePassword: async (obj: any, args: any, context: any) => {

            //const { salt, hash } = await hashPassword(args.password);

            //const user = await UserService.update(args.id, { hash, salt });

            //return user;
        //},
        //changeUserClass: async (obj: any, args: any, context: any) => {
            //const user = await UserService.update(args.id, { user_class: args.newClass });
            //return user;
        //},
    //},
};

export default resolvers;
