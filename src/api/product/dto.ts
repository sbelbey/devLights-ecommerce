// LIBRARIES
import mongoose from "mongoose";
// INTERFACES
import {
    IProduct,
    ProductFindPopulated,
    ProductResponse,
    ProductUpdateFields,
} from "./interface";

/**
 * Provides utility functions for working with product data.
 */
export default class ProductDto {
    /**
     * Converts a populated `ProductFindPopulated` object to a `ProductResponse` object.
     *
     * @param productFound - The populated `ProductFindPopulated` object to convert.
     * @returns A `ProductResponse` object with the relevant fields from the `productFound` object.
     */
    static single(productFound: ProductFindPopulated): ProductResponse {
        return {
            id: productFound._id.toString(),
            title: productFound.title,
            description: productFound.description,
            code: productFound.code,
            price: productFound.price,
            stock: productFound.stock,
            category: productFound.category._id,
            isNew: productFound.isNew,
            isAvailable: productFound.isAvailable,
            status: productFound.status,
            thumbnail: productFound.thumbnail,
            createdBy: productFound.createdBy._id,
        };
    }

    /**
     * Converts an array of populated `ProductFindPopulated` objects to an array of `ProductResponse` objects.
     *
     * @param productsFound - The array of populated `ProductFindPopulated` objects to convert.
     * @returns An array of `ProductResponse` objects with the relevant fields from the `productsFound` objects.
     */
    static multipleProducts(productsFound: any): ProductResponse[] {
        return productsFound.map((product: any) => {
            return {
                id: product._id.toString(),
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                stock: product.stock,
                category: product.category,
                isNew: product.isNew,
                isAvailable: product.isAvailable,
                status: product.status,
                thumbnail: product.thumbnail,
                createdBy: product.createdBy,
            };
        });
    }

    /**
     * Converts a `ProductFindPopulated` object and a `ProductUpdateFields` object into a partial `IProduct` object.
     *
     * This method is used to create an update payload for a product, by merging the existing product data with the new update fields.
     * The `category` field is updated to a `mongoose.Types.ObjectId` if a new category is provided, otherwise the existing category ID is used.
     * The `createdBy` field is set to the `createdBy._id` of the existing product.
     *
     * @param productFound - The existing `ProductFindPopulated` object.
     * @param productPayload - The `ProductUpdateFields` object containing the new update fields.
     * @returns A partial `IProduct` object with the merged product data.
     */
    static productToUpdatePayload(
        productFound: ProductFindPopulated,
        productPayload: ProductUpdateFields
    ): Partial<IProduct> {
        return {
            ...productFound,
            ...productPayload,
            category: productPayload.category
                ? new mongoose.Types.ObjectId(String(productPayload.category))
                : productFound.category._id,
            createdBy: productFound.createdBy._id,
        };
    }
}
