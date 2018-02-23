import { mergeSchemas } from 'graphql-tools';

import user from './types/user';
import root from './types/';
import userResolver from './resolvers/userResolver';

import project from './types/project';
import projectResolver from './resolvers/projectResolver';


const schema = mergeSchemas({
    schemas: [user, project, root],
    resolvers: [userResolver, projectResolver],
});

export default schema;
