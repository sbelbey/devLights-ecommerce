// INTERFACES
import { IUser } from "./interface";
// MODELS
import UserModel from "./model";

/**
 * Finds a user by their email address.
 * @param email - The email address to search for.
 * @returns The user document, or null if not found.
 */
export default class UserRepository {
    static async findUserByEmail(email: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ email }).lean();
        return user;
    }
}
