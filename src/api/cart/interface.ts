// LIBRARIES
import { Types } from "mongoose";
// INTERFACES
import { IProduct, ProductResponse } from "../product/interface";

export interface ICart {
    _id: Types.ObjectId;
    products: {
        product: Types.ObjectId;
        quantity: number;
    }[];
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface CartResponse {
    _id: Types.ObjectId;
    products: {
        product: ProductResponse;
        quantity: number;
    }[];
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface CartPopulated {
    _id: Types.ObjectId;
    products: {
        product: IProduct;
        quantity: number;
    }[];
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
