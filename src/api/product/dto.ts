// INTERFACES
import { IProduct, ProductResponse } from "./interface";

export default class ProductDto {
    static single(productFound: IProduct): ProductResponse {
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
            createdBy: productFound.createdBy,
        };
    }

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
}
