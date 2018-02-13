import { UserService } from '../../controllers/UserService';
import { IUserModel } from '../../models/UserModel';

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
};

export default resolvers;
