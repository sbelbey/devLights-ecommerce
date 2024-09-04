// LIBRARIES
import { Request, Response } from "express";
// INTERFACES
import { TicketResponse } from "./interface";
// SERVICES
import TicketService from "./service";
// UTILS
import apiResponse from "../../utils/apiResponse.utils";
import HttpError from "../../utils/HttpError.utils";
// CONSTANTS
import HTTP_STATUS from "../../constants/HttpStatus";

export default class TicketController {
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
}
