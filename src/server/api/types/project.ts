const schema = `
type Query {
    # Returns a list of projects that match specified filters. If no filters
    # are specified, this will return all users.
    projects(filters: ProjectFilter): [Project!]!
}

type Mutation {
    changeName(id: Int!, newName: String!): Project
    changeTableNumber(id: Int!, newTableNumber: Int!): Project
    changeExpoNumber(id: Int!, newExpoNUmber: Int!): Project
}

# Filters for retrieving users
input ProjectFilter {
    # a unique identifer, will return one project
    project_id: Int,
    name: String
}

type Project {
    projecct_id: Int,
    devpost_id: String,
    name: String,
    table_number: Int,
    expo_number: Int
}`;

export interface ProjectFilter {
    name?: string;
    project_id?: number;
}

export default schema;
