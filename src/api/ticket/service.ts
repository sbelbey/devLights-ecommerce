// INTERFACES
import { CartResponse } from "../cart/interface";
import {
    ITicket,
    ITicketPopulated,
    salesOfASaler,
    TicketResponse,
} from "./interface";
import { IUser } from "../user/interface";
// DAOS
import TicketDao from "./dao";
// MODELS
import TicketModel from "./model";
// REPOSITORIES
import TicketRepository from "./repository";
// DTOS
import TicketDto from "./dto";
// UTILS
import HttpError from "../../utils/HttpError.utils";
// CONSTANTS
import HTTP_STATUS from "../../constants/HttpStatus";

/**
 * Provides functionality for managing tickets, including creating new tickets, finding a user's purchased tickets, and finding tickets sold by a specific seller.
 */
export default class TicketService {
    /**
     * Creates a new ticket based on the provided cart and user information.
     *
     * @param cartToPurchase - The cart response containing the details of the items to be purchased.
     * @param user - The user who is purchasing the ticket.
     * @returns A `TicketResponse` object representing the newly created ticket.
     * @throws {HttpError} If an error occurs during the ticket creation process.
     */
    static async create(
        cartToPurchase: CartResponse,
        user: IUser
    ): Promise<TicketResponse> {
        try {
            const ticketPayload: ITicket = new TicketModel({
                cartId: cartToPurchase,
                buyerId: user,
                createdAt: new Date(),
            });

            const ticketCreated = await TicketDao.createTicket(ticketPayload);

            const ticketToResponse: TicketResponse = TicketDto.single(
                ticketCreated,
                cartToPurchase,
                user
            );

            return ticketToResponse;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );

            throw error;
        }
    }

    /**
     * Finds all tickets purchased by the specified user.
     *
     * @param user - The ID of the user whose purchased tickets should be retrieved.
     * @returns An array of `TicketResponse` objects representing the tickets purchased by the specified user.
     * @throws {HttpError} If an error occurs while retrieving the user's purchased tickets.
     */
    static async findUserPurchases(user: string): Promise<TicketResponse[]> {
        try {
            const ticketsFound: ITicketPopulated[] =
                await TicketRepository.findTicketsByBuyerId(user);

            if (!ticketsFound) {
                throw new HttpError(
                    "No tickets found",
                    "There were no tickets found user requested",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const ticketResponse: TicketResponse[] =
                TicketDto.multiple(ticketsFound);

            return ticketResponse;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );

            throw error;
        }
    }

    /**
     * Finds all tickets sold by the specified user.
     *
     * @param user - The ID of the user whose sold tickets should be retrieved.
     * @returns An object containing the total number of tickets sold by the specified user.
     * @throws {HttpError} If an error occurs while retrieving the user's sold tickets.
     */
    static async findPurchaseBySaler(user: string): Promise<salesOfASaler> {
        try {
            const ticketsFound: salesOfASaler =
                await TicketRepository.findTicketsBySellerId(user);

            if (!ticketsFound || ticketsFound.totalTickets === 0) {
                throw new HttpError(
                    "No tickets found",
                    "There were no tickets found user requested",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            return ticketsFound;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );

            throw error;
        }
    }
}
