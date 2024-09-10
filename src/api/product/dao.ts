// LIBRARIES
import { Types } from "mongoose";
// INTERFACES
import { IProduct, IProductPaginated, ProductFindPopulated } from "./interface";
// MODELS
import ProductModel from "./model";

/**
 * Provides data access operations for managing products in the system.
 */
class ProductDAO {
    /**
     * Creates a new product in the system.
     *
     * @param product - The partial product data to create a new product.
     * @returns The created product with populated `createdBy` and `category` fields.
     */
    static async create(
        product: Partial<IProduct>
    ): Promise<ProductFindPopulated> {
        return (await ProductModel.create(product)).populate([
            "createdBy",
            "category",
        ]);
    }

    /**
     * Retrieves a paginated list of products based on the provided filters and sorting options.
     *
     * @param category - The category to filter products by.
     * @param salersId - The ID of the seller to filter products by.
     * @param priceStart - The minimum price to filter products by.
     * @param priceEnd - The maximum price to filter products by.
     * @param sort - The sorting order for the products, either -1 (descending) or 1 (ascending).
     * @param page - The page number to retrieve.
     * @param limit - The number of products to return per page.
     * @returns A paginated object containing the filtered and sorted products.
     */
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

    /**
     * Retrieves a product by its unique identifier.
     *
     * @param id - The unique identifier of the product to retrieve.
     * @returns The found product, or null if no product with the given ID exists or the product is not active.
     */
    static async getById(id: string): Promise<ProductFindPopulated | null> {
        return await ProductModel.findOne({
            $and: [{ _id: new Types.ObjectId(id) }, { status: true }],
        })
            .populate(["createdBy", "category"])
            .lean();
    }

    /**
     * Updates an existing product with the provided data.
     *
     * @param id - The unique identifier of the product to update.
     * @param updateData - The partial data object containing the fields to update for the product.
     * @returns The updated product, or null if the product with the given ID does not exist or is not active.
     */
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

    /**
     * Deletes a product by setting its status to false.
     *
     * @param id - The unique identifier of the product to delete.
     * @returns The updated product with the status set to false, or null if the product with the given ID does not exist or is not active.
     */
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
