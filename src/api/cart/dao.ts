import { Document } from "mongoose";
import CartModel from "./model";
import { ICart } from "./interface";

class CartDao {
    static async create(cart: ICart) {
        return await CartModel.create(cart);
    }

    static async getAll(): Promise<Document<ICart>[]> {
        return await CartModel.find();
    }

    static async getById(id: string): Promise<Document<ICart> | null> {
        return await CartModel.findById(id);
    }

    static async update(
        id: string,
        cart: ICart
    ): Promise<Document<ICart> | null> {
        return await CartModel.findByIdAndUpdate(id, cart, { new: true });
    }

    static async delete(id: string): Promise<Document<ICart> | null> {
        return await CartModel.findByIdAndDelete(id);
    }
}

export default CartDao;
