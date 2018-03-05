import { GraphQLScalarType, Kind } from 'graphql';

const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value: string): any {
            return new Date(value);
        },
        serialize(value: Date): any {
            return value.getTime();
        },
        parseLiteral(ast: any): any {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10);
            }
            return undefined;
        },
    }),
};

export default resolvers;
