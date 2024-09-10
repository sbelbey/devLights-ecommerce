// LIBRARIES
import { Types } from "mongoose";
// INTERFACES
import { IUser } from "../user/interface";
import { CartResponse } from "../cart/interface";

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

export interface ITicketPopulated {
    _id: Types.ObjectId;
    buyerId: IUser;
    cartId: CartResponse;
    createdAt: Date;
}

export interface salesOfASaler {
    _id: Types.ObjectId;
    totalTickets: number;
    totalProducts: number;
    totalAmount: number;
    tickets: {
        _id: Types.ObjectId;
        totalProducts: number;
        totalAmount: number;
        products: Types.ObjectId[];
    }[];
}
