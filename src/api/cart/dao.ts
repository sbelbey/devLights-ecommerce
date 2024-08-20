import { DocumentType } from "@typegoose/typegoose";
import { Cart } from "./model";
import { CartModel } from "../processingModels";

/*
 * Class representing the Data Access Objetc (DAO) for carst.
 */
class CartDao {
    /**
     * Creates a new cart in the database.
     * @param {Cart} cart - The cart to create.
     * @returns {Promise<DocumentType<Cart>>} - A Promise that resolves to the created Cart.
     */
    static async create(cart: Cart): Promise<DocumentType<Cart>> {
        return await CartModel.create(cart);
    }

    /**
     * Retrieves all Carts in the database
     * @returns {Promise<DocumentType<Cart>[]>} - A Promise that resolves to an array of Carts.
     */
    static async getAll(): Promise<DocumentType<Cart>[]> {
        return await CartModel.find();
    }

    /**
     * Retrieves a Cart by its ID
     * @param {string} id - The ID of the Cart to retrieve.
     * @returns {Promise<DocumentType<Cart> | null>} - A Promise that resolves to the Cart or null if not found.
     */
    static async getById(id: string): Promise<DocumentType<Cart> | null> {
        return await CartModel.findById(id);
    }

    /**
     * Updates a Cart by its ID
     * @param {string} id - The ID of the Cart to update.
     * @param {Cart} cart - The updated Cart object.
     * @returns {Promise<DocumentType<Cart> | null>} - A Promise that resolves to the updated Cart or null if not found.
     */
    static async update(
        id: string,
        cart: Cart
    ): Promise<DocumentType<Cart> | null> {
        return await CartModel.findByIdAndUpdate(id, cart, { new: true });
    }

    /**
     * Deletes a Cart by its ID
     * @param {string} id - The ID of the Cart to delete.
     * @returns {Promise<DocumentType<Cart> | null>} - A Promise that resolves to the deleted Cart or null if not found.
     */
    static async delete(id: string): Promise<DocumentType<Cart> | null> {
        return await CartModel.findByIdAndDelete(id);
    }
}

export default CartDao;
