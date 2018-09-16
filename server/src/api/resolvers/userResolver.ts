import { UserService } from '../../controllers/UserService';
import { UserModel } from '../../models/UserModel';
import { hashPassword } from '../../util/common';
import { UserFilter } from '../types/user';
import { Action } from '../../util/Permissions';


const resolvers = {
    Query: {
        users: async (obj: any,
                      args: { filters?: UserFilter },
                      context: any) => {
            if (!context.user || !context.user.can(Action.ViewUsers)) {
                throw new Error('You do not have permission to view users');
            }

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
            if (!context.user || !context.user.can(Action.EditUser, args.id)) {
                throw new Error('You do not have permission to edit this user');
            }

            const user = await UserService.update(
                args.id,
                { name: args.newName });
            return user;
        },
        changePassword: async (obj: any,
                               args: { id?: number, newPassword?: string },
                               context: any) => {
            if (!context.user ||
                !context.user.can(Action.ChangePassword, args.id)) {
                throw new Error('You do not have permission to change this ' +
                    ' users password');
            }

            const { salt, hash } = await hashPassword(args.newPassword!);

            const user = await UserService.update(args.id!, { hash, salt });

            return user;
        },
        changeUserClass: async (obj: any, args: any, context: any) => {
            if (!context.user.can(Action.PromoteUser)) {
                throw new Error('You do not have permission to change this ' +
                    'users class');
            }

            const user = await UserService.update(
                args.id,
                { user_class: args.newClass });
            return user;
        },
    },
};

export default resolvers;
