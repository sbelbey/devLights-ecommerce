import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HTTP_STATUS from "../constants/HttpStatus";
import config from "../config/enviroment.config";
import { UserRole } from "../constants/UserRole.constants";
import HttpError from "../utils/HttpError.utils";
import apiResponse from "../utils/apiResponse.utils";

const { JWT_SECRET, SESSION_KEY } = config;

const checkUserRole = (requiredRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies[SESSION_KEY];
        }
        if (!token) {
            throw new HttpError(
                "Unauthorized",
                "Unauthorized",
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        try {
            const decodedToken: any = jwt.verify(token, JWT_SECRET);
            const userRole: UserRole = decodedToken.role;

            if (requiredRoles.includes(userRole)) {
                req.body.user = decodedToken.id;
                return next();
            }

            throw new HttpError(
                "Forbidden",
                "Forbidden",
                HTTP_STATUS.FORBIDDEN
            );
        } catch (err: any) {
            // FIXME: Replace with a next function
            const response = apiResponse(
                false,
                new HttpError(
                    err.description || err.message,
                    err.details || err.message,
                    err.status || HTTP_STATUS.UNAUTHORIZED
                )
            );
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(response);
        }
    };
};

export default checkUserRole;
