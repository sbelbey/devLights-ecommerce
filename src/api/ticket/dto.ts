import { CartResponse } from "../cart/interface";
import { IUser } from "../user/interface";
import { ITicket, TicketResponse } from "./interface";

export default class TicketDto {
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
}
