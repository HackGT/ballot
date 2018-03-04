const schema = `
type Query {
    categories(filters: CategoryFilter): [Category!]!
}

type Mutation {
   createCategory(name: String!, is_primary: Boolean!): Category!
   deleteCategory(category_id: Int!): Boolean
   updateCategory(category_id: Int!, update: PartialCategory!): Category!
}

input CategoryFilter {
    category_id: Int
}

input PartialCategory {
    name: String,
    is_primary: Boolean
}

type Category {
    category_id: Int,
    name: String,
    is_primary: Boolean,
    criteria: [Criterion!]
}

# Fake type - defined in criteria.ts
type Criterion`;

export interface CategoryFilter {
    category_id?: number;
}

export interface CategoryUpdate {
    name?: string;
    is_primary?: boolean;
}

export default schema;
