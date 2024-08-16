import { DocumentType } from "@typegoose/typegoose";
import { User, UserModel } from "./model";

export default class UserRepository {
    static async findUserByEmail(
        email: string
    ): Promise<DocumentType<User> | null> {
        const user = await UserModel.findOne({ email });
        return user;
    }
}
