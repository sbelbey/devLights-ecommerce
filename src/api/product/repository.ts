// INTERFACE
import { IProduct } from "./interface";
// MODELS
import ProductModel from "./model";

export default class ProductRepository {
    static async getProductByCode(code: string): Promise<IProduct | null> {
        const productFound: IProduct | null = await ProductModel.findOne({
            code,
        });
        return productFound;
    }
}
