import { makeExecutableSchema } from 'graphql-tools';
const { mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
import user from './types/user';
import query from './types/query';
import userResolver from './resolvers/userResolver';

const typeDefs = mergeTypes([
    user,
    query,
]);

const resolvers = mergeResolvers([
    userResolver,
]);

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

export default schema;
