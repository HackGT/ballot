import { mergeSchemas } from 'graphql-tools';

import root from './types/';
import user from './types/user';
import criteria from './types/criteria';
import category from './types/category';
import ballot from './types/ballot';

import userResolver from './resolvers/userResolver';
import categoryResolver from './resolvers/categoryResolver';
import criteriaResolver from './resolvers/criteriaResolver';
import ballotResolver from './resolvers/ballotResolver';

const schema = mergeSchemas({
    schemas: [
        user,
        criteria,
        category,
        ballot,
        root],
    resolvers: [
        userResolver,
        categoryResolver,
        criteriaResolver,
        ballotResolver,
    ],
});

export default schema;
