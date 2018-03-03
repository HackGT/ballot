import { UserService } from '../../controllers/UserService';
import { UserModel } from '../../models/UserModel';
import { hashPassword } from '../../util/common';
import { UserFilter } from '../types/user';


const resolvers = {
    Query: {
        users: async (obj: any,
                      args: { filters?: UserFilter },
                      context: any) => {
            if (args.filters && args.filters.email && args.filters.user_id) {
                throw new Error('email and user_id are both unique ' +
                    'identifiers, use only one');
            }

            let users: UserModel[];

            if (args.filters && args.filters.email) {
                const res = await UserService.findByEmail(
                    args.filters.email as string);
                users = res ? [res] : [];
            } else if (args.filters && args.filters.user_id) {
                const res = await UserService.findById(
                    args.filters.user_id as number);
                users = res ? [res] : [];
            } else {
                users = await UserService.find();
            }

            return users;
        },
    },

    Mutation: {
        changeName: async (obj: any, args: any, context: any) => {
            const user = await UserService.update(
                args.id,
                { name: args.newName });
            return user;
        },
        changePassword: async (obj: any, args: any, context: any) => {

            const { salt, hash } = await hashPassword(args.password);

            const user = await UserService.update(args.id, { hash, salt });

            return user;
        },
        changeUserClass: async (obj: any, args: any, context: any) => {
            const user = await UserService.update(
                args.id,
                { user_class: args.newClass });
            return user;
        },
    },
};

export default resolvers;
