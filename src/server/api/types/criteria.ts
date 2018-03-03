const schema = `
type Query {
    criteria: [Criteria!]!
}

type Criteria {
    criteria_id: Int,
    name: String,
    rubric: String,
    min_score: Int,
    max_score: Int,
    category_id: Int
}`;

export default schema;
