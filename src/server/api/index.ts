import { mergeSchemas } from 'graphql-tools';

import user from './types/user';
import root from './types/';
import userResolver from './resolvers/userResolver';

import category from './types/category';
import categoryResolver from './resolvers/categoryResolver';

const schema = mergeSchemas({
    schemas: [user, category, root],
    resolvers: [userResolver, categoryResolver],
});

export default schema;
