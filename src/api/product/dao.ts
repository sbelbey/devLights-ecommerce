import { DocumentType } from "@typegoose/typegoose";
import { Product } from "./model";
import { ProductModel } from "../processingModels";

class ProductDAO {
    /**
     * Creates a new product in the database.
     * @param {Product} product - The product object to be created.
     * @returns {Promise<DocumentType<Product>>} A Promise that resolves to the created Product.
     */
    static async create(product: Product): Promise<DocumentType<Product>> {
        return await ProductModel.create(product);
    }

    /**
     * Retrieves all products from the database.
     * @returns {Promise<DocumentType<Product>[]>} A Promise that resolves to an array of Products.
     */
    static async getAll(): Promise<DocumentType<Product>[]> {
        return await ProductModel.find();
    }

    /**
     * Retrieves a product by its ID from the database.
     * @param {string} id - The ID of the product to retrieve.
     * @returns {Promise<DocumentType<Product> | null>} A Promise that resolves to the found Product or null if not found.
     */
    static async getById(id: string): Promise<DocumentType<Product> | null> {
        return await ProductModel.findById(id);
    }

    /**
     * Updates a product in the database.
     * @param {string} id - The ID of the product to update.
     * @param {Product} product - The updated product object.
     * @returns {Promise<DocumentType<Product> | null>} A Promise that resolves to the updated Product or null if not found.
     */
    static async update(
        id: string,
        product: Product
    ): Promise<DocumentType<Product> | null> {
        return await ProductModel.findByIdAndUpdate(id, product, {
            new: true,
        });
    }

    /**
     * Deletes a product from the database.
     * @param {string} id - The ID of the product to delete.
     * @returns {Promise<DocumentType<Product> | null>} A Promise that resolves to the deleted Product or null if not found.
     */
    static async delete(id: string): Promise<DocumentType<Product> | null> {
        return await ProductModel.findByIdAndDelete(id);
    }
}

export default ProductDAO;
