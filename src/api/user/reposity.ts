// INTERFACES
import { IUser } from "./interface";
// MODELS
import UserModel from "./model";

export default class UserRepository {
    /**
     * Finds a user by their email address.
     *
     * @param email - The email address of the user to find.
     * @returns The user object if found, or `null` if not found.
     */
    static async findUserByEmail(email: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ email }).lean();
        return user;
    }
}
