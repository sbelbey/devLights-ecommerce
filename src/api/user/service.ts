// INTERFACES
import { ICart } from "../cart/interface";
import {
    IUser,
    UserCreateFields,
    UserLoginFields,
    UserResponse,
    UserUpdateFields,
} from "./interface";
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
// DTOS
import UserDto from "./dto";
// CONSTANTS
import HTTP_STATUS from "../../constants/HttpStatus";
import { MulterFiles } from "../../interfaces/file.interface";

export default class UserService {
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
            const cartCreated: ICart = await CartService.createCart();

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
}
