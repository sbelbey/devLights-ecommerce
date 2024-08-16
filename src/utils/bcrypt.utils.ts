import bcrypt from "bcrypt";
import { User } from "../api/user/model";

export class BcryptUtils {
    static createHash(password: string) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    static isValidPassword(user: User, password: string) {
        return bcrypt.compareSync(password, user.password);
    }
}
