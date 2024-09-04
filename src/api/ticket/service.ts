// INTERFACES
import { CartResponse } from "../cart/interface";
import { ITicket, TicketResponse } from "./interface";
import { IUser } from "../user/interface";
// DAOS
import TicketDao from "./dao";
// MODELS
import TicketModel from "./model";
// DTOS
import TicketDto from "./dto";
// UTILS
import HttpError from "../../utils/HttpError.utils";
// CONSTANTS
import HTTP_STATUS from "../../constants/HttpStatus";

export default class TicketService {
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
}
