const schema = `
type Query {
    # Returns a list of users that match specified filters. If no filters
    # are specified, this will return all users.
    users(filters: UserFilter): [User!]!
}

type Mutation {
    changeName(id: Int!, newName: String!): User
    changePassword(id: Int!, newPassword: String!): User
    changeUserClass(id: Int!, newClass: UserClass!): User
}

# Filters for retrieving users
input UserFilter {
    # a unique identifier, will return one user
    email: String

    # a unique identifer, will return one user
    user_id: Int

    # # the class of the user
    # user_class: UserClass
}

# Users can be pending approval to access the app, a judge, admin,
# or a non-removable admin (owner).
enum UserClass {
    Pending
    Judge
    Admin
    Owner
}

type User {
    user_id: Int,
    email: String,
    name: String,
    user_class: String,

    # unique identifier to github account, used for authentication
    github: String,

    # unique identifier to google account, used for authentication
    google: String,

    # unique identifier to facebook account, used for authentication
    facebook: String
}`;

export interface UserFilter {
    email?: string;
    user_id?: number;
    // user_class?: string;
}

export default schema;
