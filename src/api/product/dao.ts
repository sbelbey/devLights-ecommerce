// INTERFACES
import { IProduct, IProductPaginated } from "./interface";
// MODELS
import ProductModel from "./model";

class ProductDAO {
    static async create(product: Partial<IProduct>): Promise<IProduct> {
        return await ProductModel.create(product);
    }

    static async getAll(
        category: string | undefined,
        salersId: string | undefined,
        priceStart: number | undefined,
        priceEnd: number | undefined,
        sort: -1 | 1 | undefined,
        page: string | undefined,
        limit: string | undefined
    ): Promise<IProductPaginated> {
        const query = {
            ...(category ? { category } : {}),
            ...(salersId ? { createdBy: salersId } : {}),
            ...(priceStart && priceEnd
                ? { price: { $gte: priceStart, $lte: priceEnd } }
                : {}),
        };

        const options = {
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
            ...(sort ? { sort: { price: sort } } : {}),
            lean: true,
            populate: ["category"],
        };

        const result = await ProductModel.paginate(query, options);
        return result;
    }

    static async getById(id: string): Promise<IProduct | null> {
        return await ProductModel.findById(id).populate(
            "createdBy",
            "_id firstName lastName email"
        );
    }

    static async update(
        id: string,
        updateData: Partial<IProduct>
    ): Promise<IProduct | null> {
        return await ProductModel.findByIdAndUpdate(id, updateData, {
            new: true,
        });
    }

    static async delete(id: string): Promise<IProduct | null> {
        return await ProductModel.findByIdAndDelete(id);
    }
}

export default ProductDAO;
