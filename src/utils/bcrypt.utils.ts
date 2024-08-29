import bcrypt from "bcrypt";
import { IUser } from "../api/user/interface";

export class BcryptUtils {
    static createHash(password: string) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    static isValidPassword(user: IUser, password: string) {
        return bcrypt.compareSync(password, user.password);
    }
}
