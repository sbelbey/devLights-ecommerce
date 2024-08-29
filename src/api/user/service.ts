import HTTP_STATUS from "../../constants/HttpStatus";
import HttpError from "../../utils/HttpError.utils";
import UserDao from "./dao";
import {
    IUser,
    UserCreateFields,
    UserLoginFields,
    UserResponse,
} from "./interface";
import UserRepository from "./reposity";
import { BcryptUtils } from "../../utils/bcrypt.utils";
import UserDto from "./dto";

/**
 * Provides user-related services, including creating users, retrieving user information, and user authentication.
 */
export default class UserService {
    /**
     * Creates a new user in the system.
     *
     * @param user - The user creation fields, including email, password, and any other required fields.
     * @returns A promise that resolves to the created user's response data.
     * @throws {HttpError} If a user with the provided email already exists.
     * @throws {HttpError} If there is an error creating the user.
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

            const userPayload = {
                ...user,
                password: BcryptUtils.createHash(user.password),
                createdAt: new Date(),
            };

            const userCreated = await UserDao.create(userPayload);

            const userCleaned = UserDto.userDTO(
                userCreated as unknown as IUser
            );
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
     * @throws {HttpError} If the user is not found.
     * @throws {HttpError} If there is an error retrieving the user.
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
     * @returns A promise that resolves to an array of user response data.
     * @throws {HttpError} If no users are found.
     * @throws {HttpError} If there is an error retrieving the users.
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
     * Authenticates a user by their email and password.
     *
     * @param userLoginPayload - The user's email and password for login.
     * @returns A promise that resolves to the authenticated user's response data.
     * @throws {HttpError} If the user's credentials are invalid.
     * @throws {HttpError} If there is an error retrieving the user.
     */
    static async login(
        userLoginPayload: UserLoginFields
    ): Promise<UserResponse> {
        try {
            const userFound = await UserRepository.findUserByEmail(
                userLoginPayload.email
            );

            if (!userFound) {
                throw new HttpError(
                    "Invalid credentials",
                    "Invalid credentials",
                    HTTP_STATUS.FORBIDDEN
                );
            }

            const isValidPassword = BcryptUtils.isValidPassword(
                userFound as unknown as IUser,
                userLoginPayload.password
            );

            if (!isValidPassword) {
                throw new HttpError(
                    "Invalid credentials",
                    "Invalid credentials",
                    HTTP_STATUS.FORBIDDEN
                );
            }

            const user: UserResponse = UserDto.userDTO(
                userFound as unknown as IUser
            );

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
