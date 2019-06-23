import * as mongoose from 'mongoose';

export enum UserRole {
    Owner = 'owner',
    Admin = 'admin',
    Judge = 'judge',
    Pending = 'pending',
}

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    role: UserRole;
    tags: string[];
    hash: string;
    salt: string;
}

export const UserSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    role: {
        type: String,
        required: true,
        enum: ['owner', 'admin', 'judge', 'pending'],
    },
    tags: { type: [String], required: false },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
