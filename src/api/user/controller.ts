// LIBRARIES
import { Request, Response } from "express";
// INTERFACES
import {
    assignRoleFields,
    UserCreateFields,
    UserLoginFields,
    UserResponse,
    UserUpdateFields,
} from "./interface";
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
    /**
     * Creates a new user in the system.
     *
     * @param req - The Express request object containing the user data.
     * @param res - The Express response object to send the created user data.
     * @returns A Promise that resolves to the created user data.
     */
    static async createUser(req: Request, res: Response): Promise<Response> {
        // FIXME: Check if the requester is an admin, and admit only admins to create users with roles
        try {
            const userData: UserCreateFields = req.body;
            const files = req.files as MulterFiles;
            if (files && files["profile"] && files["profile"][0]) {
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

    /**
     * Retrieves a user by their unique identifier.
     *
     * @param req - The Express request object containing the user ID in the URL parameters.
     * @param res - The Express response object to send the retrieved user data.
     * @returns A Promise that resolves to the retrieved user data.
     */
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

    /**
     * Retrieves all users from the system.
     *
     * @param req - The Express request object.
     * @param res - The Express response object to send the retrieved user data.
     * @returns A Promise that resolves to the retrieved user data.
     */
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

    /**
     * Handles the login process for a user.
     *
     * @param req - The Express request object containing the user's login payload.
     * @param res - The Express response object to send the authenticated user data.
     * @returns A Promise that resolves to the authenticated user data.
     */
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

    /**
     * Updates a user's information in the system.
     *
     * @param req - The Express request object containing the user data to update.
     * @param res - The Express response object to send the updated user data.
     * @returns A Promise that resolves to the updated user data.
     */
    static async updateUser(req: Request, res: Response): Promise<Response> {
        try {
            const userData: UserUpdateFields = req.body;
            const userId: string = req.body.user;
            const files = req.files as MulterFiles;

            const userResponse: UserResponse = await UserService.updateUser(
                userId,
                userData,
                files
            );
            const response = apiResponse(true, userResponse);
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

    /**
     * Assigns a role to a user in the system.
     *
     * @param req - The Express request object containing the user ID and role data to assign.
     * @param res - The Express response object to send the updated user data.
     * @returns A Promise that resolves to the updated user data.
     */
    static async assignRole(req: Request, res: Response): Promise<Response> {
        try {
            const data: assignRoleFields = req.body;
            const userToChange: string = req.params.id;

            const userUpdated: UserResponse = await UserService.assignRole(
                userToChange,
                data
            );

            const response = apiResponse(true, userUpdated);
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
}
