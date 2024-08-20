import { DocumentType } from "@typegoose/typegoose";
import { User } from "./model";
import { UserResponse } from "./interfaces";

export default class UserDto {
    /**
     * Converts an array of `User` documents to an array of `UserResponse` objects.
     *
     * @param users - An array of `DocumentType<User>` objects representing the users to be converted.
     * @returns An array of `UserResponse` objects, each containing the `id`, `firstName`, `lastName`, `email`, and `role` properties of the corresponding `User` document.
     */
    static usersArrayDTO(users: DocumentType<User>[]): UserResponse[] {
        return users.map((user) => {
            return {
                id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            };
        });
    }

    /**
     * Converts a single `User` document to a `UserResponse` object.
     *
     * @param user - A `DocumentType<User>` object representing the user to be converted.
     * @returns A `UserResponse` object containing the `id`, `firstName`, `lastName`, `email`, and `role` properties of the corresponding `User` document.
     */
    static userDTO(user: DocumentType<User>): UserResponse {
        return {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };
    }
}
