const schema = `
type Query {
    user(email: String, id: String): [User!]!
}

schema {
    query: Query
}`;

export default schema;
