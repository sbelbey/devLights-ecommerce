// LIBRARIES
import { Request, Response } from "express";
// INTERFACES
import { CartResponse } from "./interface";
// SERVICES
import { CartService } from "./service";
// UTILS
import apiResponse from "../../utils/apiResponse.utils";
import HttpError from "../../utils/HttpError.utils";
import SessionUtils from "../../utils/Session.utils";
// CONSTANTS
import HTTP_STATUS from "../../constants/HttpStatus";
// ENVIROMENT VARIABLES
import config from "../../config/enviroment.config";

const { SESSION_KEY } = config;

export default class CartController {
    static async addToCart(req: Request, res: Response): Promise<Response> {
        try {
            const { id, productId } = req.params;
            const { cartId, user } = req.body;

            if (id !== cartId) {
                throw new HttpError(
                    "Invalid cart id",
                    "You must be the cart owner to add a product to the cart",
                    HTTP_STATUS.BAD_REQUEST
                );
            }

            const cartResponse: CartResponse = await CartService.addToCart(
                id,
                productId,
                user
            );

            const response = apiResponse(true, cartResponse);
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

    static async purchase(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { cartId, user } = req.body;

            if (id !== cartId) {
                throw new HttpError(
                    "Invalid cart id",
                    "You must be the cart owner to purchase the cart",
                    HTTP_STATUS.BAD_REQUEST
                );
            }

            const { ticketCreated, userUpdateResponse } =
                await CartService.purchase(id, user);

            const accessToken: string =
                SessionUtils.generateToken(userUpdateResponse);

            res.cookie(SESSION_KEY, accessToken, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });

            const response = apiResponse(true, ticketCreated);
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
