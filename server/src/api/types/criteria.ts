const schema = `
type Query {
    criteria: [Criterion!]!
}

type Mutation {
    addCriterion(category_id: Int!, name: String!,
    rubric: String!, min_score: Int!, max_score: Int!, category_id: Int!)
        : Criterion!
    updateCriterion(criteria_id: Int!, update: PartialCriterion!): Criterion!
    deleteCriterion(criteria_id: Int!): Boolean
}

input PartialCriterion {
    name: String,
    rubric: String,
    min_score: Int,
    max_score: Int,
    category_id: Int
}

type Criterion {
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
