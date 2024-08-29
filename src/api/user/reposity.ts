import { Document } from "mongoose";
import { IUser } from "./interface";
import UserModel from "./model";

/**
 * Finds a user by their email address.
 * @param email - The email address to search for.
 * @returns The user document, or null if not found.
 */
export default class UserRepository {
    /**
     * Finds a user by their email address.
     * @param email - The email address to search for.
     * @returns The user document, or null if not found.
     */
    static async findUserByEmail(email: string) {
        const user = await UserModel.findOne({ email }).lean();
        return user;
    }
}
