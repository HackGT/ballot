import { IUserModel } from "../models/UserModel";
import * as db from '../db';


export class UserService {

    public static find(): Promise<[IUserModel]> {
        db.query("SELECT * FROM users", [], (err, res)=> {
            
        });
    }

    public static findById(id: string): Promise<IUserModel> {

    }

    public static create(user: IUserModel): Promise<IUserModel> {

    }

    public static update(id: string, user: IUserModel): Promise<IUserModel> {

    }

    public static delete(id: string): Promise<void> {

    }
}