// INTERFACES
import {
    IProduct,
    ProductCreateFields,
    ProductFilteredResponse,
    ProductResponse,
} from "./interface";
// TYPES
import { ProductSearchParamsQuery } from "./types";
// MODELS
import ProductModel from "./model";
// DAOS
import CategoryDAO from "../category/dao";
import ProductDAO from "./dao";
// REPOSITORIES
import ProductRepository from "./repository";
// DTOS
import ProductDto from "./dto";
// UTILS
import HttpError from "../../utils/HttpError.utils";
import AuditData from "../../utils/AuditData.utils";
// CONSTANTS
import HTTP_STATUS from "../../constants/HttpStatus";

export default class ProductServices {
    static async findByProductId(productId: string): Promise<ProductResponse> {
        try {
            const producFound: IProduct | null = await ProductDAO.getById(
                productId
            );

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

    static async findProducts(
        productSearchParams: ProductSearchParamsQuery
    ): Promise<ProductFilteredResponse> {
        try {
            const {
                category,
                salersId,
                priceRange,
                filterByPrice,
                page,
                limit,
            } = productSearchParams;

            let priceStart: number | undefined;
            let priceEnd: number | undefined;
            let sort: -1 | 1 | undefined;

            if (filterByPrice) {
                sort = filterByPrice === "asc" ? 1 : -1;
            }

            if (priceRange) {
                const [start, end] = priceRange.split(",");
                priceStart = Number(start);
                priceEnd = Number(end);
            }

            const productFound = await ProductDAO.getAll(
                category,
                salersId,
                priceStart,
                priceEnd,
                sort,
                page,
                limit
            );

            if (!productFound.docs.length) {
                throw new HttpError(
                    "Products not found",
                    "PRODUCTS_NOT_FOUND",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const products: ProductResponse[] = ProductDto.multipleProducts(
                productFound.docs
            );

            const productsFiltered: ProductFilteredResponse = {
                products,
                totalDocs: productFound.totalDocs,
                limit: productFound.limit,
                totalPages: productFound.totalPages,
                page: productFound.page,
                pagingCounter: productFound.pagingCounter,
                hasPrevPage: productFound.hasPrevPage,
                hasNextPage: productFound.hasNextPage,
                prevPage: productFound.prevPage,
                nextPage: productFound.nextPage,
            };

            return productsFiltered;
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
        user: string,
        productPayload: ProductCreateFields
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

            const productWithAuditData: Partial<IProduct> =
                AuditData.addCreateData(user, {
                    ...productPayload,
                    category: categoryFound._id,
                });

            const productToCreate: IProduct = new ProductModel(
                productWithAuditData
            );

            const productCreated: IProduct = await ProductDAO.create(
                productToCreate
            );

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
