// INTERFACES
import { CartResponse } from "../cart/interface";
import { IUser } from "../user/interface";
import { ITicket, ITicketPopulated, TicketResponse } from "./interface";

/**
 * Provides methods for generating ticket response data.
 */
export default class TicketDto {
    /**
     * Generates a single ticket response object from the provided ticket, cart, and user data.
     *
     * @param ticketCreated - The ticket object to generate the response from.
     * @param cart - The cart object associated with the ticket.
     * @param user - The user object associated with the ticket.
     * @returns A TicketResponse object containing the ticket details.
     */
    static single(
        ticketCreated: ITicket,
        cart: CartResponse,
        user: IUser
    ): TicketResponse {
        return {
            id: ticketCreated._id.toString(),
            buyerName: `${user.firstName} ${user.lastName}`,
            buyerEmail: user.email,
            products: cart.products.map((product) => {
                return {
                    productTitle: product.product.title,
                    productPrice: product.product.price,
                    productQuantity: product.quantity,
                };
            }),
            totalPrice: parseFloat(
                cart.products
                    .reduce((acc, product) => {
                        return acc + product.product.price * product.quantity;
                    }, 0)
                    .toFixed(3)
            ),
            createdAt: ticketCreated.createdAt,
        };
    }

    /**
     * Generates an array of TicketResponse objects from the provided array of ITicketPopulated objects.
     *
     * @param tickets - An array of ITicketPopulated objects representing the tickets to generate the responses for.
     * @returns An array of TicketResponse objects containing the details of the provided tickets.
     */
    static multiple(tickets: ITicketPopulated[]): TicketResponse[] {
        return tickets.map((ticket) => {
            return {
                id: ticket._id.toString(),
                buyerName:
                    ticket.buyerId.firstName + " " + ticket.buyerId.lastName,
                buyerEmail: ticket.buyerId.email,
                products: ticket.cartId.products.map((item) => {
                    return {
                        productTitle: item.product.title,
                        productPrice: item.product.price,
                        productQuantity: item.quantity,
                    };
                }),
                totalPrice: parseFloat(
                    ticket.cartId.products
                        .reduce((acc, product) => {
                            return (
                                acc + product.product.price * product.quantity
                            );
                        }, 0)
                        .toFixed(3)
                ),
                createdAt: ticket.createdAt,
            };
        });
    }
}
