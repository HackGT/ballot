const schema = `
type Query {
    # Returns a list of projects that match specified filters. If no filters
    # are specified, this will return all users.
    projects(filters: ProjectFilter): [Project!]!
}

type Mutation {
    createProject(input: ProjectInput): Project
    updateProject(id: Int!, input: ProjectInput): Project
}

# Filters for retrieving users
input ProjectFilter {
    # a unique identifer, will return one project
    project_id: Int,
    devpost_id: String
}

input ProjectInput {
  devpost_id: String,
  name: String,
  table_number: Int,
  expo_number: Int
}

type Project {
    project_id: Int,
    devpost_id: String,
    name: String,
    table_number: Int,
    expo_number: Int
}`;

export interface ProjectFilter {
    devpost_id?: string;
    project_id?: number;
}

export default schema;
