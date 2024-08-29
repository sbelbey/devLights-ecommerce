import { Request, Response } from "express";
import HttpError from "../../utils/HttpError.utils";
import HTTP_STATUS from "../../constants/HttpStatus";
import { UserCreateFields, UserLoginFields, UserResponse } from "./interface";
import UserService from "./service";
import apiResponse from "../../utils/apiResponse.utils";
import SessionUtils from "../../utils/Session.utils";
import config from "../../config/enviroment.config";

const { SESSION_KEY } = config;

/**
 * Provides functionality for managing user-related operations in the application.
 */
export default class UserController {
    /**
     * Creates a new user in the system.
     *
     * @param req - The Express request object containing the user data in the request body.
     * @param res - The Express response object to send the API response.
     * @returns A Promise that resolves to the API response with the created user data.
     */
    static async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const userData: UserCreateFields = req.body;

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
     * Retrieves a user or a list of users from the system.
     *
     * @param req - The Express request object containing the user ID in the query parameters.
     * @param res - The Express response object to send the API response.
     * @returns A Promise that resolves to the API response with the requested user data.
     */
    static async getUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId: string | undefined = req.query.id as string;

            let user: UserResponse | UserResponse[] | null = null;

            if (userId) {
                user = await UserService.getUserById(userId);
            } else {
                user = await UserService.getAllUsers();
            }

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
     * Handles the login process for a user.
     *
     * @param req - The Express request object containing the user login payload in the request body.
     * @param res - The Express response object to send the API response.
     * @returns A Promise that resolves to the API response with the authenticated user data and an access token.
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
}
