const schema = `
type Mutation {
    changeName(email: String, newName: String): User
    changePassword(email: String, newPassword: String): User
    changeUserClass(email: String, newClass: Int): User
}

schema {
    mutation: Mutation
}`;

export default schema;
