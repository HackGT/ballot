import { mergeSchemas } from 'graphql-tools';

import root from './types/';
import user from './types/user';
import criteria from './types/criteria';
import category from './types/category';
import project from './types/project';
import ballot from './types/ballot';

import userResolver from './resolvers/userResolver';
import categoryResolver from './resolvers/categoryResolver';
import criteriaResolver from './resolvers/criteriaResolver';
import projectResolver from './resolvers/projectResolver';
import ballotResolver from './resolvers/ballotResolver';

const schema = mergeSchemas({
    schemas: [
        user,
        criteria,
        category,
        ballot,
        project,
        root],
    resolvers: [
        userResolver,
        categoryResolver,
        criteriaResolver,
        projectResolver,
        ballotResolver,
    ],
});

export default schema;
