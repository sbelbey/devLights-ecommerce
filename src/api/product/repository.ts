import { DocumentType } from "@typegoose/typegoose";
import { Product } from "./model";
import { ProductModel } from "../processingModels";

export default class ProductRepository {
    /**
     * Retrieves a product by its code.
     *
     * @param code - The code of the product to retrieve.
     * @returns The product with the specified code, or `null` if not found.
     */
    static async getProductByCode(
        code: string
    ): Promise<DocumentType<Product> | null> {
        const productFound: DocumentType<Product> | null =
            await ProductModel.findOne({ code });
        return productFound;
    }
}
