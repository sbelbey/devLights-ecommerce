import { create } from "domain";
import HTTP_STATUS from "../../constants/HttpStatus";
import HttpError from "../../utils/HttpError.utils";
import UserDao from "./dao";
import { UserCreateFields, UserResponse } from "./interfaces";
import { User, UserModel } from "./model";
import UserRepository from "./reposity";
import { BcryptUtils } from "../../utils/bcrypt.utils";
import { DocumentType } from "@typegoose/typegoose";
import UserDto from "./dto";

export default class UserService {
    static async createUser(
        user: UserCreateFields
    ): Promise<DocumentType<User>> {
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

            return userCreated;
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
}
