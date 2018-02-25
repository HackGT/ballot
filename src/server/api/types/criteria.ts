const schema = `
type Query {
    getCriteria(category_id: Int): [Criteria!]!
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
