// LIBRARIES
import { sign } from "jsonwebtoken";
// INTERFACES
import { UserResponse } from "../api/user/interface";
// ENVIRONMENT VARIABLES
import config from "../config/enviroment.config";

const { JWT_SECRET } = config;

export default class SessionUtils {
    /**
     * Generates a JSON Web Token (JWT) for a given user.
     *
     * @param user - The user object containing the necessary information to generate the token.
     * @returns The generated JWT token.
     */
    static generateToken(user: UserResponse): string {
        const token: string = sign(user, JWT_SECRET, { expiresIn: "1h" });
        return token;
    }
}
