const schema = `
type Query {
    project: [Project!]!
}

type Project {
    project_id: Int,
    devpost_id: String,
    name: String,
    table_number: Int,
    expo_number: Int,
    categories: [Category!]!
}

type Category
type Criterion
`;

export default schema;
