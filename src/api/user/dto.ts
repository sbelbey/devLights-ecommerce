import { DocumentType } from "@typegoose/typegoose";
import { User } from "./model";
import { UserResponse } from "./interfaces";

export default class UserDto {
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
