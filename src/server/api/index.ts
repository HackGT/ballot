import { mergeSchemas } from 'graphql-tools';

import user from './types/user';
import root from './types/';
import userResolver from './resolvers/userResolver';


const schema = mergeSchemas({
    schemas: [user, root],
    resolvers: [userResolver],
});

export default schema;
