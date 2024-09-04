// INTERFACES
import { IUser, UserResponse } from "./interface";

export default class UserDto {
    static usersArrayDTO(users: IUser[]): UserResponse[] {
        return users.map((user) => {
            return {
                id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                cart: user.cart,
            };
        });
    }

    static userDTO(user: IUser): UserResponse {
        return {
            id: user._id?.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            cart: user.cart,
        };
    }
}
