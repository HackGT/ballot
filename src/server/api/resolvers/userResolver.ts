import { UserService } from '../../controllers/UserService';
import { IUserModel } from '../../models/UserModel';
import { Permissions } from '../../util/Permissions';
import * as crypto from 'crypto';
import { pbkdf2Async } from '../../util/common';


const resolvers = {
    Query: {
        users: () => {
            const users = UserService.find();
            if (users !== undefined) {
                return users;
            }
            return [];
        },

        user: async (obj: any, args: any, context: any) => {
            let user: IUserModel | undefined = undefined;
            if (args.email) {
                user = await UserService.findByEmail(args.email);
            } else if (args.id) {
                user = await UserService.findById(args.id);
            }
            return user;
        },
    },

    Mutation: {
        changeName: async (obj: any, args: any, context: any) => {
            let user: IUserModel | undefined = undefined;
            if (args.email) {
                user = await UserService.update(args.email, {name : args.newName});
            }// else if (args.id) {
                // TODO allow updating by args.id
            // }
            return user;
        },
        changePassword: async (obj: any, args: any, context: any) => {
            let user: IUserModel | undefined = undefined;
            if (Permissions.canDo(context.user, '') && args.newPassword) {

                const salt = crypto.randomBytes(32);
                const hash = await pbkdf2Async(args.newPassword, salt, 3000);

                user = await UserService.update(args.email, {hash, salt});
            }
            return user;
        },
        changeUserClass: async (obj: any, args: any, context: any) => {
            let user: IUserModel | undefined = undefined;
            if (args.email) {
                user = await UserService.update(args.email, {userClass : args.newClass});
            }
            return user;
        },
    },
};

export default resolvers;
