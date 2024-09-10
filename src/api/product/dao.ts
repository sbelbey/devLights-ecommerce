// LIBRARIES
import { Types } from "mongoose";
// INTERFACES
import { IProduct, IProductPaginated, ProductFindPopulated } from "./interface";
// MODELS
import ProductModel from "./model";

class ProductDAO {
    static async create(
        product: Partial<IProduct>
    ): Promise<ProductFindPopulated> {
        return (await ProductModel.create(product)).populate([
            "createdBy",
            "category",
        ]);
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
            status: true,
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

    static async getById(id: string): Promise<ProductFindPopulated | null> {
        return await ProductModel.findOne({
            $and: [{ _id: new Types.ObjectId(id) }, { status: true }],
        })
            .populate(["createdBy", "category"])
            .lean();
    }

    static async update(
        id: string,
        updateData: Partial<IProduct>
    ): Promise<ProductFindPopulated | null> {
        return await ProductModel.findByIdAndUpdate(id, updateData, {
            new: true,
        })
            .populate(["createdBy", "category"])
            .lean();
    }

    static async delete(id: string): Promise<ProductFindPopulated | null> {
        return await ProductModel.findByIdAndUpdate(
            id,
            { status: false },
            { new: true }
        )
            .populate(["createdBy", "category"])
            .lean();
    }
}

export default ProductDAO;
