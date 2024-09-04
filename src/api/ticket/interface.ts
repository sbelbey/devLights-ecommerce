// LIBRARIES
import { Types } from "mongoose";

export interface TicketResponse {
    id: string;
    buyerName: string;
    buyerEmail: string;
    products: {
        productTitle: string;
        productPrice: number;
        productQuantity: number;
    }[];
    totalPrice: number;
    createdAt: Date;
}

export interface ITicket {
    _id: Types.ObjectId;
    buyerId: Types.ObjectId;
    cartId: Types.ObjectId;
    createdAt: Date;
}
