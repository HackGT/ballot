import { UserService } from '../../controllers/UserService';
import { IUserModel, UserClass } from '../../models/UserModel';
import * as crypto from 'crypto';
import { pbkdf2Async } from '../../util/common';
import { UserFilter } from '../types/user';


const resolvers = {
    Query: {
        users: async (obj: any, args: { filters?: UserFilter }, context: any) => {
            if (args.filters && args.filters.email && args.filters.user_id) {
                throw new Error('email and user_id are both unique identifiers, use only one');
            }

            let users: IUserModel[];

            if (args.filters && args.filters.email) {
                const res = await UserService.findByEmail(args.filters.email as string);
                users = res ? [res] : [];
            } else if (args.filters && args.filters.user_id) {
                const res = await UserService.findById(args.filters.user_id as number);
                users = res ? [res] : [];
            } else {
                users = await UserService.find();
            }

            return users;
        },
    },

    Mutation: {
        changeName: async (obj: any, args: any, context: any) => {
            const user = await UserService.update(args.id, { name: args.newName });
            return user;
        },
        changePassword: async (obj: any, args: any, context: any) => {
            const salt = crypto.randomBytes(32);
            const hash = await pbkdf2Async(args.newPassword, salt, 3000);

            const user = await UserService.update(args.id, { hash, salt });

            return user;
        },
        changeUserClass: async (obj: any, args: any, context: any) => {
            const user = await UserService.update(args.id, { user_class: UserClass[args.newClass] });
            return user;
        },
    },

    User: {
        user_class: (obj: any, args: any, context: any) => {
            return UserClass[obj.user_class];
        },
    },
};

export default resolvers;
