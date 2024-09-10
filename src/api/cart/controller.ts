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

/**
 * Handles the logic for adding a product to a user's cart and purchasing the cart.
 *
 * The `addToCart` method adds a product to the specified cart, ensuring that the user is the owner of the cart.
 * The `purchase` method purchases the specified cart, generating an access token for the user.
 */
export default class CartController {
    /**
     * Adds a product to the specified cart, ensuring that the user is the owner of the cart.
     *
     * @param req - The Express request object, containing the cart ID, product ID, and user information.
     * @param res - The Express response object, which will be used to send the API response.
     * @returns A Promise that resolves to the API response, containing the updated cart information.
     * @throws {HttpError} If the cart ID in the request does not match the cart ID in the request body, or if an error occurs during the operation.
     */
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

    /**
     * Purchases the specified cart, generating an access token for the user.
     *
     * @param req - The Express request object, containing the cart ID and user information.
     * @param res - The Express response object, which will be used to send the API response.
     * @returns A Promise that resolves to the API response, containing the created ticket and updated user information.
     * @throws {HttpError} If the cart ID in the request does not match the cart ID in the request body, or if an error occurs during the operation.
     */
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
