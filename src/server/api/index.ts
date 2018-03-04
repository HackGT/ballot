import { mergeSchemas } from 'graphql-tools';

import user from './types/user';
import root from './types/';
import criteria from './types/criteria';
import userResolver from './resolvers/userResolver';

import category from './types/category';
import categoryResolver from './resolvers/categoryResolver';
import criteriaResolver from './resolvers/criteriaResolver';

const schema = mergeSchemas({
    schemas: [user, criteria, category, root],
    resolvers: [userResolver, categoryResolver, criteriaResolver],
});

export default schema;
