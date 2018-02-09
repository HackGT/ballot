import { UserService } from '../../controllers/UserService';
import { IUserModel } from '../../models/UserModel';

const resolvers = {
    Query: {
        user: (obj: any, args: any, context: any) => {
            let users: Array<Promise<IUserModel | undefined>>;
            if (args.email) {
                users = [UserService.findByEmail(args.email)];
            } else if (args.id) {
                users = [UserService.findByEmail(args.id)];
            } else {
                users = UserService.find() as any;
            }
            return users;
        },
    },

    Mutation: {

    },
};

export default resolvers;
