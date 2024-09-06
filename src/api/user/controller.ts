// LIBRARIES
import { Request, Response } from "express";
// INTERFACES
import { UserCreateFields, UserLoginFields, UserResponse } from "./interface";
import { MulterFiles } from "../../interfaces/file.interface";
// SERVICES
import UserService from "./service";
// UTILS
import apiResponse from "../../utils/apiResponse.utils";
import SessionUtils from "../../utils/Session.utils";
import HttpError from "../../utils/HttpError.utils";
// CONSTANTS
import HTTP_STATUS from "../../constants/HttpStatus";
// ENVIROMENT VARIABLES
import config from "../../config/enviroment.config";

const { SESSION_KEY } = config;

/**
 * Provides functionality for managing user-related operations in the application.
 */
export default class UserController {
    static async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const userData: UserCreateFields = req.body;
            const files = req.files as MulterFiles;
            if (files && files["profile"][0]) {
                userData.avatarUrl = files.profile[0].path.split("public")[1];
            }

            const user: UserResponse = await UserService.createUser(userData);

            const response = apiResponse(true, user);
            return res.status(HTTP_STATUS.CREATED).json(response);
        } catch (err: any) {
            // FIXME: Replace with a next function and a logger
            const response = apiResponse(
                false,
                new HttpError(
                    err.description || err.message,
                    err.details || err.message,
                    err.status || HTTP_STATUS.SERVER_ERROR
                )
            );
            return res
                .status(err.status || HTTP_STATUS.SERVER_ERROR)
                .json(response);
        }
    }

    static async getUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId: string = req.params.id;

            let user: UserResponse = await UserService.getUserById(userId);

            const response = apiResponse(true, user);
            return res.status(HTTP_STATUS.OK).json(response);
        } catch (err: any) {
            const response = apiResponse(
                false,
                new HttpError(
                    err.description || err.message,
                    err.details || err.message,
                    err.status || HTTP_STATUS.SERVER_ERROR
                )
            );
            return res
                .status(err.status || HTTP_STATUS.SERVER_ERROR)
                .json(response);
        }
    }

    static async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users: UserResponse[] = await UserService.getAllUsers();

            const response = apiResponse(true, users);
            return res.status(HTTP_STATUS.OK).json(response);
        } catch (err: any) {
            const response = apiResponse(
                false,
                new HttpError(
                    err.description || err.message,
                    err.details || err.message,
                    err.status || HTTP_STATUS.SERVER_ERROR
                )
            );
            return res
                .status(err.status || HTTP_STATUS.SERVER_ERROR)
                .json(response);
        }
    }

    static async login(req: Request, res: Response): Promise<Response> {
        try {
            const loginPayload: UserLoginFields = req.body;

            const userFound: UserResponse = await UserService.login(
                loginPayload
            );

            const accessToken: string = SessionUtils.generateToken(userFound);

            res.cookie(SESSION_KEY, accessToken, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });

            const response = apiResponse(true, userFound);
            return res.status(HTTP_STATUS.ACCEPTED).json(response);
        } catch (err: any) {
            // FIXME: Replace with a next function and a logger
            const response = apiResponse(
                false,
                new HttpError(
                    err.description || err.message,
                    err.details || err.message,
                    err.status || HTTP_STATUS.SERVER_ERROR
                )
            );
            return res
                .status(err.status || HTTP_STATUS.SERVER_ERROR)
                .json(response);
        }
    }
}
