import { IProduct } from "../product/interface";
import { IUser } from "../user/interface";

export interface ICart {
    products: {
        product: IProduct;
        quantity: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    owner: IUser;
}
