const schema = `
type Query {
    criteria: [Criteria!]!
}

type Mutation {
    addCriterion(category_id: Int!, criteria_id: Int!, name: String!,
    rubric: String!, min_score: Int!, max_score: Int!, category_id: Int!)
        : Criteria!
    updateCriterion(criteria_id: Int!, update: CriterionUpdate!): Criteria!
}

input CriterionUpdate {
    name: String,
    rubric: String,
    min_score: Int,
    max_score: Int,
    category_id: Int
}

type Criteria {
    criteria_id: Int,
    name: String,
    rubric: String,
    min_score: Int,
    max_score: Int,
    category_id: Int
}`;

export interface CriterionUpdate {
    name?: string;
    rubric?: string;
    min_score?: number;
    max_score?: number;
    category_id?: number;
}
export default schema;
