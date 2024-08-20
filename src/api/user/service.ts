import { create } from "domain";
import HTTP_STATUS from "../../constants/HttpStatus";
import HttpError from "../../utils/HttpError.utils";
import UserDao from "./dao";
import { UserCreateFields, UserLoginFields, UserResponse } from "./interfaces";
import { User } from "./model";
import UserRepository from "./reposity";
import { BcryptUtils } from "../../utils/bcrypt.utils";
import { DocumentType } from "@typegoose/typegoose";
import UserDto from "./dto";
import { UserModel } from "../processingModels";

export default class UserService {
    /**
     * Creates a new user in the system.
     *
     * @param user - The user creation fields, including email, password, and any other required fields.
     * @returns A Promise that resolves to the created user document.
     * @throws {HttpError} If a user with the provided email already exists, or an error occurs while creating the user.
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

            const userPayload = new UserModel({
                ...user,
                password: BcryptUtils.createHash(user.password),
                createdAt: new Date(),
            });

            const userCreated = await UserDao.create(userPayload);

            const userCleaned = UserDto.userDTO(userCreated);
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
     * @returns A Promise that resolves to a `UserResponse` object representing the retrieved user.
     * @throws {HttpError} If the user is not found, or an error occurs while retrieving the user.
     */
    static async getUserById(userId: string): Promise<UserResponse> {
        try {
            const userFound: DocumentType<User> | null = await UserDao.getById(
                userId
            );

            if (!userFound) {
                throw new HttpError(
                    "User not found",
                    "USER_NOT_FOUND",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const user: UserResponse = UserDto.userDTO(userFound);

            return user;
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
     * @returns A Promise that resolves to an array of `UserResponse` objects, representing all the users found in the database.
     * @throws {HttpError} If no users are found, or an error occurs while retrieving the users.
     */
    static async getAllUsers(): Promise<UserResponse[]> {
        try {
            const usersFound: DocumentType<User>[] = await UserDao.getAll();

            if (!usersFound || !usersFound.length) {
                throw new HttpError(
                    "Users not found",
                    "USERS_NOT_FOUND",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const users: UserResponse[] = UserDto.usersArrayDTO(usersFound);

            return users;
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
     * Attempts to log in a user with the provided email and password.
     *
     * @param userLoginPayload - An object containing the email and password of the user attempting to log in.
     * @returns A `UserResponse` object containing the user's information if the login is successful.
     * @throws {HttpError} If the user is not found or the password is invalid.
     */
    static async login(
        userLoginPayload: UserLoginFields
    ): Promise<UserResponse> {
        try {
            const userFound: DocumentType<User> | null =
                await UserRepository.findUserByEmail(userLoginPayload.email);

            if (!userFound) {
                throw new HttpError(
                    "Invalid credentials",
                    "Invalid credentials",
                    HTTP_STATUS.FORBIDDEN
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
                    HTTP_STATUS.FORBIDDEN
                );
            }

            const user: UserResponse = UserDto.userDTO(userFound);

            return user;
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
