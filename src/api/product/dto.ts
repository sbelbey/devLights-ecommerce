import { DocumentType } from "@typegoose/typegoose";
import { ProductResponse } from "./interface";
import { Product } from "./model";

export default class ProductDto {
    static single(productFound: DocumentType<Product>): ProductResponse {
        return {
            id: productFound._id.toString(),
            title: productFound.title,
            description: productFound.description,
            code: productFound.code,
            price: productFound.price,
            stock: productFound.stock,
            category: productFound.category,
            isNew: productFound.isNew,
            isAvailable: productFound.isAvailable,
            status: productFound.status,
            thumbnail: productFound.thumbnail,
            createdBy: productFound.createdBy.toString(),
        };
    }

    static multipleProducts(
        productsFound: DocumentType<Product>[]
    ): ProductResponse[] {
        return productsFound.map((product: DocumentType<Product>) => {
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
                createdBy: product.createdBy.toString(),
            };
        });
    }
}
