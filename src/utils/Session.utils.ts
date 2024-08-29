import { sign } from "jsonwebtoken";
import config from "../config/enviroment.config";
import { UserResponse } from "../api/user/interface";

const { JWT_SECRET } = config;

export default class SessionUtils {
    /**
     * Generates a JSON Web Token (JWT) for the provided user.
     *
     * @param user - The user object to generate the token for.
     * @returns The generated JWT token.
     */
    static generateToken(user: UserResponse): string {
        const token: string = sign(user, JWT_SECRET, { expiresIn: "1h" });
        return token;
    }
}
