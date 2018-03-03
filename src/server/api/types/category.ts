const schema = `
type Query {
    categories: [Category!]!
}

type Mutation {
   create(category_id: Int!, name: String!, is_primary: Boolean!): Category!
   delete(category_id: Int!): Boolean
   update(category_id: Int!, update: CategoryUpdate!): Category!
}

input CategoryFilter {
    category_id: Int
}

input CategoryUpdate {
    name: String,
    is_primary: Boolean
}

type Category {
    category_id: Int,
    name: String,
    is_primary: Boolean
}`;

export interface CategoryFilter {
    category_id?: number;
}

export interface CategoryUpdate {
    name?: string;
    is_primary?: boolean;
}

export default schema;
