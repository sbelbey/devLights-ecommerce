// INTERFACES
import { IUser } from "./interface";
// MODELS
import UserModel from "./model";

class UserDao {
    static async create(user: IUser): Promise<IUser> {
        return await UserModel.create(user);
    }

    static async getAll(): Promise<IUser[]> {
        return await UserModel.find().lean();
    }

    static async getById(id: string): Promise<IUser | null> {
        return await UserModel.findById(id).lean();
    }

    static async update(id: string, user: IUser): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(id, user, {
            new: true,
        });
    }

    static async delete(id: string): Promise<IUser | null> {
        return await UserModel.findByIdAndDelete(id);
    }
}

export default UserDao;
