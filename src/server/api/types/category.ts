const schema = `
type Query {
    categories(filters: CategoryFilter): [Category!]!
}

type Mutation {
   createCategory(category_id: Int, name: String, is_primary: Boolean): Category!
   addCriteria(category_id: Int, name: String, rubric: String, min_score: Int, max_score: Int): Category!
}

input CategoryFilter {
    name: String
    category_id: Int,
}

type Category {
    category_id: Int,
    name: String,
    is_primary: Boolean
}`;

export interface CategoryFilter {
    name?: string;
    category_id?: number;
}

export default schema;
