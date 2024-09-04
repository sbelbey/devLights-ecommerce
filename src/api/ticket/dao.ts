// INTERFACES
import { ITicket } from "./interface";
// DAOS
import TicketModel from "./model";

export default class TicketDao {
    public static async createTicket(ticket: ITicket): Promise<ITicket> {
        return TicketModel.create(ticket);
    }

    public static async getTicketById(
        ticketId: string
    ): Promise<ITicket | null> {
        return TicketModel.findById(ticketId).lean();
    }

    public static async updateTicket(
        ticketId: string,
        updatedTicket: ITicket
    ): Promise<ITicket | null> {
        return TicketModel.findByIdAndUpdate(ticketId, updatedTicket, {
            new: true,
        }).lean();
    }

    public static async getAllTickets(): Promise<ITicket[] | null> {
        return TicketModel.find()
        .lean();
    }
}
