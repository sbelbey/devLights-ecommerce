// INTERFACE
import { IProduct } from "./interface";
// MODELS
import ProductModel from "./model";

export default class ProductRepository {
    /**
     * Retrieves a product by its unique code.
     *
     * @param code - The unique code of the product to retrieve.
     * @returns The product if found, or `null` if not found.
     */
    static async getProductByCode(code: string): Promise<IProduct | null> {
        const productFound: IProduct | null = await ProductModel.findOne({
            code,
        });
        return productFound;
    }
}
