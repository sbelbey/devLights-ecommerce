// INTERFACES
import { ITicket } from "./interface";
// DAOS
import TicketModel from "./model";

/**
 * Provides data access operations for managing tickets.
 */
export default class TicketDao {
    /**
     * Creates a new ticket in the system.
     *
     * @param ticket - The ticket object to create.
     * @returns The created ticket.
     */
    public static async createTicket(ticket: ITicket): Promise<ITicket> {
        return TicketModel.create(ticket);
    }

    /**
     * Retrieves a ticket by its unique identifier.
     *
     * @param ticketId - The unique identifier of the ticket to retrieve.
     * @returns The ticket if found, otherwise `null`.
     */
    public static async getTicketById(
        ticketId: string
    ): Promise<ITicket | null> {
        return TicketModel.findById(ticketId).lean();
    }

    /**
     * Updates an existing ticket in the system.
     *
     * @param ticketId - The unique identifier of the ticket to update.
     * @param updatedTicket - The updated ticket object.
     * @returns The updated ticket if successful, otherwise `null`.
     */
    public static async updateTicket(
        ticketId: string,
        updatedTicket: ITicket
    ): Promise<ITicket | null> {
        return TicketModel.findByIdAndUpdate(ticketId, updatedTicket, {
            new: true,
        }).lean();
    }

    /**
     * Retrieves all tickets in the system.
     *
     * @returns An array of all tickets, or `null` if no tickets are found.
     */
    public static async getAllTickets(): Promise<ITicket[] | null> {
        return TicketModel.find().lean();
    }
}
