// INTERFACES
import { IUser, UserResponse } from "./interface";

/**
 * Utility class for transforming `IUser` objects into `UserResponse` objects.
 *
 * The `usersArrayDTO` method maps an array of `IUser` objects to an array of `UserResponse` objects.
 * The `userDTO` method transforms a single `IUser` object into a `UserResponse` object.
 *
 * These methods are used to prepare user data for API responses, hiding internal implementation details
 * and exposing only the necessary public properties.
 */
export default class UserDto {
    /**
     * Maps an array of `IUser` objects to an array of `UserResponse` objects.
     *
     * This method is used to transform an array of user data objects into a format suitable for API responses.
     * It maps each `IUser` object to a corresponding `UserResponse` object, exposing only the necessary public properties.
     *
     * @param users - An array of `IUser` objects to be transformed.
     * @returns An array of `UserResponse` objects representing the transformed user data.
     */
    static usersArrayDTO(users: IUser[]): UserResponse[] {
        return users.map((user) => {
            return {
                id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                cart: user.cart,
                avatarUrl: user.avatarUrl,
            };
        });
    }

    /**
     * Transforms a single `IUser` object into a `UserResponse` object.
     *
     * This method is used to transform a user data object into a format suitable for API responses.
     * It exposes only the necessary public properties of the `IUser` object in the `UserResponse` object.
     *
     * @param user - The `IUser` object to be transformed.
     * @returns A `UserResponse` object representing the transformed user data.
     */
    static userDTO(user: IUser): UserResponse {
        return {
            id: user._id?.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            cart: user.cart,
            avatarUrl: user.avatarUrl,
        };
    }
}
