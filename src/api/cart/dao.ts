// LIBRARIES
import { Types } from "mongoose";
// INTERFACES
import { CartPopulated, ICart } from "./interface";
// MODELS
import CartModel from "./model";

/**
 * Provides data access operations for managing shopping carts.
 */
class CartDao {
    /**
     * Creates a new shopping cart.
     * @param cart - The cart object to create.
     * @returns The created cart, populated with related data.
     */
    static async create(cart: ICart): Promise<CartPopulated> {
        return (await CartModel.create(cart)).populate({
            path: "products",
            populate: { path: "product", model: "Product" },
        });
    }

    /**
     * Retrieves all shopping carts.
     * @returns A Promise that resolves to an array of `ICart` objects representing all shopping carts.
     */
    static async getAll(): Promise<ICart[]> {
        return await CartModel.find();
    }

    /**
     * Retrieves a shopping cart by its unique identifier.
     * @param id - The ID of the shopping cart to retrieve.
     * @returns A Promise that resolves to the populated shopping cart, or `null` if not found.
     */
    static async getById(id: string): Promise<CartPopulated | null> {
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

    /**
     * Updates an existing shopping cart.
     * @param id - The ID of the shopping cart to update.
     * @param cart - The updated cart object.
     * @returns The updated cart, populated with related data, or `null` if the cart was not found.
     */
    static async update(
        id: string,
        cart: ICart
    ): Promise<CartPopulated | null> {
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

    /**
     * Deletes a shopping cart by its unique identifier.
     * @param id - The ID of the shopping cart to delete.
     * @returns A Promise that resolves to the deleted shopping cart, or `null` if not found.
     */
    static async delete(id: string): Promise<ICart | null> {
        return await CartModel.findByIdAndDelete(id);
    }
}

export default CartDao;
