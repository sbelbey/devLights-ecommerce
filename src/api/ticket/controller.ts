// LIBRARIES
import { Request, Response } from "express";
// INTERFACES
import { ITicketPopulated, salesOfASaler, TicketResponse } from "./interface";
// SERVICES
import TicketService from "./service";
// UTILS
import apiResponse from "../../utils/apiResponse.utils";
import HttpError from "../../utils/HttpError.utils";
// CONSTANTS
import HTTP_STATUS from "../../constants/HttpStatus";

/**
 * Provides controller methods for handling ticket-related API requests.
 */
export default class TicketController {
    /**
     * Retrieves the list of tickets purchased by the user.
     *
     * @param req - The Express request object containing the user information.
     * @param res - The Express response object to send the API response.
     * @returns A Promise that resolves to the API response containing the list of tickets purchased by the user.
     */
    static async getPurchases(req: Request, res: Response): Promise<Response> {
        try {
            const { user } = req.body;

            const ticketsResponse: TicketResponse[] =
                await TicketService.findUserPurchases(user);

            if (!ticketsResponse.length) {
                throw new HttpError(
                    "No tickets found",
                    "There were no tickets found for the user requetes.",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const response = apiResponse(true, ticketsResponse);
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
     * Retrieves the list of sales made by a specific saler.
     *
     * @param req - The Express request object containing the saler information.
     * @param res - The Express response object to send the API response.
     * @returns A Promise that resolves to the API response containing the list of sales made by the saler.
     */
    static async getPurchaseBySaler(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const { user } = req.body;

            const sales: salesOfASaler =
                await TicketService.findPurchaseBySaler(user);

            if (!sales) {
                throw new HttpError(
                    "No sales found",
                    "There were no sale found for the saler.",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const response = apiResponse(true, sales);
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
     * Retrieves the list of purchases made by a specific user.
     *
     * @param req - The Express request object containing the user ID.
     * @param res - The Express response object to send the API response.
     * @returns A Promise that resolves to the API response containing the list of purchases made by the user.
     */
    static async getAllPurchaseByUser(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const { id } = req.params;

            const userPurchases: TicketResponse[] =
                await TicketService.findUserPurchases(id);

            if (!userPurchases) {
                throw new HttpError(
                    "No purchases found",
                    "There were no purchases found",
                    HTTP_STATUS.NOT_FOUND
                );
            }
            const response = apiResponse(true, userPurchases);
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
