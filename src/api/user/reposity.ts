import { DocumentType } from "@typegoose/typegoose";
import { User } from "./model";
import { UserModel } from "../processingModels";

export default class UserRepository {
    /**
     * Finds a user by their email address.
     *
     * @param email - The email address of the user to find.
     * @returns The user document if found, or `null` if not found.
     */
    static async findUserByEmail(
        email: string
    ): Promise<DocumentType<User> | null> {
        const user = await UserModel.findOne({ email });
        return user;
    }
}
