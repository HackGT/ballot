const schema = `
type Query {
    project: [Project!]!
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

type Category
type Criterion
`;

export default schema;
