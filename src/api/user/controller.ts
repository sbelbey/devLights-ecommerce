import { Request, Response } from "express";
// import UserService from "./service";
import HttpError from "../../utils/HttpError.utils";
import HTTP_STATUS from "../../constants/HttpStatus";
import { UserCreateFields, UserResponse } from "./interfaces";
import UserService from "./service";
import apiResponse from "../../utils/apiResponse.utils";
import { DocumentType } from "@typegoose/typegoose";
import { User } from "./model";

export default class UserController {
    static async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const userData: UserCreateFields = req.body;

            const user = await UserService.createUser(userData);

            const response = apiResponse(true, user);
            return res.status(200).json(response);
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

            let user: UserResponse | UserResponse[] | null = null;
            if (userId) {
                user = await UserService.getUserById(userId);
            } else {
                user = await UserService.getAllUsers();
            }

            const response = apiResponse(true, user);
            return res.status(200).json(response);
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

        return res.status(200).json({ message: "User created" });
    }
}
