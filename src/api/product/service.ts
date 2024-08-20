import { DocumentType } from "@typegoose/typegoose";
import { Request } from "express";
import ProductDto from "./dto";
import HTTP_STATUS from "../../constants/HttpStatus";
import HttpError from "../../utils/HttpError.utils";
import ProductDAO from "./dao";
import { ProductCreateFields, ProductResponse } from "./interface";
import { Product } from "./model";
import ProductRepository from "./repository";
import AuditData from "../../utils/AuditData.utils";
import { ProductModel } from "../processingModels";
import CategoryDAO from "../category/dao";

export default class ProductServices {
    static async findByProductId(productId: string): Promise<ProductResponse> {
        try {
            const producFound: DocumentType<Product> | null =
                await ProductDAO.getById(productId);

            if (!producFound) {
                throw new HttpError(
                    "Product not found",
                    "PRODUCT_NOT_FOUND",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const product: ProductResponse = ProductDto.single(producFound);

            return product;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );

            throw error;
        }
    }

    static async findProducts(): Promise<ProductResponse[]> {
        try {
            const productFound: DocumentType<Product>[] =
                await ProductDAO.getAll();

            if (productFound.length) {
                throw new HttpError(
                    "Product not found",
                    "PRODUCT_NOT_FOUND",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const products: ProductResponse[] =
                ProductDto.multipleProducts(productFound);

            return products;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );

            throw error;
        }
    }

    static async createProduct(
        productPayload: ProductCreateFields,
        req: Request
    ): Promise<ProductResponse> {
        try {
            const productFound = await ProductRepository.getProductByCode(
                productPayload.code
            );

            if (productFound) {
                throw new HttpError(
                    "Product already exists",
                    "PRODUCT_ALREADY_EXISTS",
                    HTTP_STATUS.CONFLICT
                );
            }

            const categoryFound = await CategoryDAO.getById(
                productPayload.category
            );

            if (!categoryFound) {
                throw new HttpError(
                    "Category not found",
                    "CATEGORY_NOT_FOUND",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const productWithAuditData = AuditData.addCreateData(
                req,
                productPayload
            );

            const productToCreatePayload: Product = new ProductModel(
                productWithAuditData
            );

            const productCreated: DocumentType<Product> =
                await ProductDAO.create(productToCreatePayload);

            const productCreatedResponse: ProductResponse =
                ProductDto.single(productCreated);

            return productCreatedResponse;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );
            throw error;
        }
    }
}
