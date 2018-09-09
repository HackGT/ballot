const schema = `
type Query {
    project: [Project!]!
}

type Mutation {
    batchUploadProjects(projects: [PartialProject!]!): [Project!]!
}

type Project {
    project_id: Int,
    devpost_id: String,
    name: String,
    table_number: String,
    expo_number: Int,
    sponsor_prizes: String,
    categories: [Category!]!
}

input PartialProject {
    devpost_id: String,
    name: String,
    table_number: String,
    expo_number: Int,
    sponsor_prizes: String
}

type Category
type Criterion
`;

export default schema;
