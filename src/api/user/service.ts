// INTERFACES
import { CartPopulated, ICart } from "../cart/interface";
import {
    assignRoleFields,
    IUser,
    UserCreateFields,
    UserLoginFields,
    UserResponse,
    UserUpdateFields,
} from "./interface";
import { MulterFiles } from "../../interfaces/file.interface";
// MODELS
import UserModel from "./model";
// DAOS
import UserDao from "./dao";
// REPOSITORIES
import UserRepository from "./reposity";
// SERVICES
import { CartService } from "../cart/service";
// UTILS
import HttpError from "../../utils/HttpError.utils";
import { BcryptUtils } from "../../utils/bcrypt.utils";
import AuditData from "../../utils/AuditData.utils";
// DTOS
import UserDto from "./dto";
// CONSTANTS
import HTTP_STATUS from "../../constants/HttpStatus";

/**
 * Provides user-related services, including creating, retrieving, updating, and assigning roles to users.
 */
export default class UserService {
    /**
     * Creates a new user with the provided user data, including creating a new cart for the user.
     *
     * @param user - The user data to create the new user with.
     * @returns A promise that resolves to the created user's response data.
     * @throws {HttpError} If a user with the provided email already exists, or if there was an error creating the user or their cart.
     */
    static async createUser(user: UserCreateFields): Promise<UserResponse> {
        try {
            const userFound = await UserRepository.findUserByEmail(user.email);

            if (userFound) {
                throw new HttpError(
                    "User already exists",
                    "USER_ALREADY_EXISTS",
                    HTTP_STATUS.CONFLICT
                );
            }
            const cartCreated: CartPopulated = await CartService.createCart();

            if (!cartCreated) {
                throw new HttpError(
                    "Cart not created",
                    "CART_NOT_CREATED",
                    HTTP_STATUS.SERVER_ERROR
                );
            }

            const userPayload: IUser = new UserModel({
                ...user,
                password: BcryptUtils.createHash(user.password),
                createdAt: new Date(),
                cart: cartCreated._id,
            });

            const userCreated: IUser = await UserDao.create(userPayload);

            if (!userCreated) {
                throw new HttpError(
                    "User not created",
                    "USER_NOT_CREATED",
                    HTTP_STATUS.SERVER_ERROR
                );
            }

            const userCleaned: UserResponse = UserDto.userDTO(userCreated);
            return userCleaned;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );

            throw error;
        }
    }

    /**
     * Retrieves a user by their unique identifier.
     *
     * @param userId - The unique identifier of the user to retrieve.
     * @returns A promise that resolves to the user's response data.
     * @throws {HttpError} If the user is not found, or an error occurs during the retrieval process.
     */
    static async getUserById(userId: string): Promise<UserResponse> {
        try {
            const userFound: IUser | null = await UserDao.getById(userId);

            if (!userFound) {
                throw new HttpError(
                    "User not found",
                    "USER_NOT_FOUND",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const userCleaned: UserResponse = UserDto.userDTO(userFound);

            return userCleaned;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );

            throw error;
        }
    }

    /**
     * Retrieves all users from the database.
     *
     * @returns A promise that resolves to an array of user response data.
     * @throws {HttpError} If no users are found, or an error occurs during the retrieval process.
     */
    static async getAllUsers(): Promise<UserResponse[]> {
        try {
            const usersFound: IUser[] = await UserDao.getAll();

            if (!usersFound || !usersFound.length) {
                throw new HttpError(
                    "Users not found",
                    "USERS_NOT_FOUND",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const usersCleaned: UserResponse[] =
                UserDto.usersArrayDTO(usersFound);

            return usersCleaned;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );

            throw error;
        }
    }

    /**
     * Authenticates a user by verifying their email and password.
     *
     * @param userLoginPayload - An object containing the user's email and password.
     * @returns A promise that resolves to the authenticated user's response data.
     * @throws {HttpError} If the user is not found or the password is invalid.
     */
    static async login(
        userLoginPayload: UserLoginFields
    ): Promise<UserResponse> {
        try {
            const userFound: IUser | null =
                await UserRepository.findUserByEmail(userLoginPayload.email);

            if (!userFound) {
                throw new HttpError(
                    "Invalid credentials",
                    "Invalid credentials",
                    HTTP_STATUS.UNAUTHORIZED
                );
            }

            const isValidPassword = BcryptUtils.isValidPassword(
                userFound,
                userLoginPayload.password
            );

            if (!isValidPassword) {
                throw new HttpError(
                    "Invalid credentials",
                    "Invalid credentials",
                    HTTP_STATUS.UNAUTHORIZED
                );
            }

            const userCleaned: UserResponse = UserDto.userDTO(userFound);

            return userCleaned;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );
            throw error;
        }
    }

    /**
     * Updates a user's information in the database.
     *
     * @param userId - The ID of the user to update.
     * @param userUpdatePayload - An object containing the updated user information.
     * @param files - An optional object containing any uploaded files, such as a profile picture.
     * @returns A promise that resolves to the updated user's response data.
     * @throws {HttpError} If the user is not found or the update fails.
     */
    static async updateUser(
        userId: string,
        userUpdatePayload: UserUpdateFields,
        files?: MulterFiles
    ): Promise<UserResponse> {
        try {
            const userFound: IUser | null = await UserDao.getById(userId);

            if (!userFound) {
                throw new HttpError(
                    "User not found",
                    "USER_NOT_FOUND",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            let avatarUrl: string = userFound.avatarUrl;

            if (files && files["profile"] && files["profile"][0]) {
                avatarUrl = files.profile[0].path.split("public")[1];
            }

            const userToUpdate: IUser = {
                ...userFound,
                ...userUpdatePayload,
                password: userUpdatePayload.password
                    ? BcryptUtils.createHash(userUpdatePayload.password)
                    : userFound.password,
                updatedAt: new Date(),
                avatarUrl,
            };

            const userUpdated: IUser | null = await UserDao.update(
                userId,
                userToUpdate
            );

            if (!userUpdated) {
                throw new HttpError(
                    "User not updated",
                    "USER_NOT_UPDATED",
                    HTTP_STATUS.SERVER_ERROR
                );
            }

            const userCleaned: UserResponse = UserDto.userDTO(userUpdated);

            return userCleaned;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );
            throw error;
        }
    }

    /**
     * Assigns a new role to a user.
     *
     * @param userToChange - The ID of the user to update.
     * @param data - An object containing the new role to assign to the user.
     * @returns The updated user data.
     * @throws {HttpError} If the user is not found or the update fails.
     */
    static async assignRole(
        userToChange: string,
        data: assignRoleFields
    ): Promise<UserResponse> {
        try {
            const userFound: IUser | null = await UserDao.getById(userToChange);
            if (!userFound) {
                throw new HttpError(
                    "User not found",
                    "USER_NOT_FOUND",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const userToUpdate: IUser = {
                ...userFound,
                role: data.role,
            };

            const userWithAuditData: IUser = AuditData.addUpdateData(
                data.user,
                userToUpdate
            );
            const userUpdated: IUser | null = await UserDao.update(
                userToChange,
                userWithAuditData
            );

            if (!userUpdated) {
                throw new HttpError(
                    "User not updated",
                    "USER_NOT_UPDATED",
                    HTTP_STATUS.SERVER_ERROR
                );
            }

            const userCleaned: UserResponse = UserDto.userDTO(userUpdated);

            return userCleaned;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );
            throw error;
        }
    }
}
