// LIBRARIES
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// ENVIRONMENT VARIABLES
import config from "../config/enviroment.config";
// UTILS
import HttpError from "../utils/HttpError.utils";
import apiResponse from "../utils/apiResponse.utils";
// CONSTANTS
import HTTP_STATUS from "../constants/HttpStatus";
import { UserRole } from "../constants/UserRole.constants";

const { JWT_SECRET, SESSION_KEY } = config;

const checkUserRole = (requiredRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies[SESSION_KEY];
        }
        if (!token) {
            const response = apiResponse(
                false,
                new HttpError(
                    "Unauthorized",
                    "You must be logged in to access this resource.",
                    HTTP_STATUS.UNAUTHORIZED
                )
            );
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(response);
        }

        const decodedToken: any = jwt.verify(token, JWT_SECRET);
        const userRole: UserRole = decodedToken.role;

        if (requiredRoles.includes(userRole)) {
            req.body.user = decodedToken.id;
            if (decodedToken.role === UserRole.USER) {
                req.body.cartId = decodedToken.cart;
            }
            return next();
        }
        const response = apiResponse(
            false,
            new HttpError(
                "Forbidden",
                "You do not have permission to access this resource.",
                HTTP_STATUS.FORBIDDEN
            )
        );
        return res.status(HTTP_STATUS.FORBIDDEN).json(response);
    };
};

export default checkUserRole;
