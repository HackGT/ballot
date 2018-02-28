import { mergeSchemas } from 'graphql-tools';

import user from './types/user';
import root from './types/';
import userResolver from './resolvers/userResolver';
import { User } from '../controllers/UserService';

export interface ResolverContext {
    user: User;
}

const schema = mergeSchemas({
    schemas: [user, root],
    // TODO: Keep resolver argument type annotations without needing to cast the resolver to any
    resolvers: [userResolver as any], 
});

export default schema;
