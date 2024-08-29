import { IUser, UserResponse } from "./interface";

/**
 * Utility class for converting `IUser` objects to `UserResponse` objects.
 */
export default class UserDto {
    /**
     * Converts an array of `IUser` objects to an array of `UserResponse` objects.
     *
     * @param users - An array of `IUser` objects to be converted.
     * @returns An array of `UserResponse` objects representing the input `IUser` objects.
     */
    static usersArrayDTO(users: IUser[]): UserResponse[] {
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
     * Converts an `IUser` object to a `UserResponse` object.
     *
     * @param user - The `IUser` object to be converted.
     * @returns A `UserResponse` object representing the input `IUser` object.
     */
    static userDTO(user: IUser): UserResponse {
        return {
            id: user._id?.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };
    }
}
