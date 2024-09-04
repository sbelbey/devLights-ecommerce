// LIBRARIES
import { Document, Types } from "mongoose";
// INTERFACES
import { ICart } from "./interface";
// MODELS
import CartModel from "./model";

class CartDao {
    static async create(cart: ICart): Promise<ICart> {
        return await CartModel.create(cart);
    }

    static async getAll(): Promise<ICart[]> {
        return await CartModel.find();
    }

    static async getById(id: string): Promise<ICart | null> {
        return await CartModel.findById(id)
            .populate({
                path: "products",
                populate: { path: "product", model: "Product" },
            })
            .populate({
                path: "products.product",
                populate: {
                    path: "category",
                    model: "Category",
                },
            })
            .lean();
    }

    static async update(id: string, cart: ICart): Promise<ICart | null> {
        return await CartModel.findByIdAndUpdate(new Types.ObjectId(id), cart, {
            new: true,
        })
            .populate({
                path: "products",
                populate: { path: "product", model: "Product" },
            })
            .populate({
                path: "products.product",
                populate: {
                    path: "category",
                    model: "Category",
                },
            })
            .lean();
    }

    static async delete(id: string): Promise<ICart | null> {
        return await CartModel.findByIdAndDelete(id);
    }
}

export default CartDao;
