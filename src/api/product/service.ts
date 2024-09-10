// INTERFACES
import {
    IProduct,
    ProductCreateFields,
    ProductFilteredResponse,
    ProductFindPopulated,
    ProductResponse,
    ProductUpdateFields,
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
import { MulterFiles } from "../../interfaces/file.interface";

export default class ProductServices {
    static async findByProductId(productId: string): Promise<ProductResponse> {
        try {
            const producFound: ProductFindPopulated | null =
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

            const productCreated: ProductFindPopulated =
                await ProductDAO.create(productToCreate);

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

    static async updateProduct(
        productId: string,
        productPayload: ProductUpdateFields,
        files?: MulterFiles
    ): Promise<ProductResponse> {
        try {
            const productFound: ProductFindPopulated | null =
                await ProductDAO.getById(productId);

            if (!productFound) {
                throw new HttpError(
                    "Product not found",
                    "Product does not exist.",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            if (productFound.createdBy._id.toString() !== productPayload.user) {
                throw new HttpError(
                    "UNAUTHORIZED",
                    "You are not authorized to update this product",
                    HTTP_STATUS.UNAUTHORIZED
                );
            }

            // FIXME: Improve this funtionality, to allow the remove selected images or all of them.
            if (files && files["products"]) {
                const imagesToLoad = files["products"].map(
                    (img) => img.path.split("public")[1]
                );
                if (
                    files["products"].length > 0 &&
                    files["products"].length + productFound.thumbnail.length >
                        10 &&
                    files["products"].length <= 10
                ) {
                    productFound.thumbnail = [...imagesToLoad];
                }

                productFound.thumbnail = [
                    ...productFound.thumbnail,
                    ...imagesToLoad,
                ];
            }

            if (
                productPayload.category &&
                productPayload.category !== productFound.category._id.toString()
            ) {
                const categoryFound = await CategoryDAO.getById(
                    productPayload.category
                );

                if (!categoryFound) {
                    throw new HttpError(
                        "Category not found",
                        "The category that you are trying to update does not exist.",
                        HTTP_STATUS.NOT_FOUND
                    );
                }
            }

            const productToUpdate: Partial<IProduct> =
                ProductDto.productToUpdatePayload(productFound, productPayload);

            const productWithAuditData: Partial<IProduct> =
                AuditData.addUpdateData(productPayload.user, productToUpdate);

            const productUpdated: ProductFindPopulated | null =
                await ProductDAO.update(productId, productWithAuditData);

            if (!productUpdated) {
                throw new HttpError(
                    "Product not found",
                    "Product did not update.",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const productUpdatedResponse: ProductResponse =
                ProductDto.single(productUpdated);

            return productUpdatedResponse;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );
            throw error;
        }
    }

    static async deleteProduct(
        productId: string,
        user: string
    ): Promise<ProductResponse> {
        try {
            const productFound: ProductFindPopulated | null =
                await ProductDAO.getById(productId);
            if (!productFound) {
                throw new HttpError(
                    "Product not found",
                    "Product does not exist.",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            if (productFound.createdBy._id.toString() !== user) {
                throw new HttpError(
                    "UNAUTHORIZED",
                    "You are not authorized to delete this product",
                    HTTP_STATUS.UNAUTHORIZED
                );
            }

            const productDeleted = await ProductDAO.delete(productId);

            if (!productDeleted) {
                throw new HttpError(
                    "Product did not delete",
                    "Product did not delete.",
                    HTTP_STATUS.NOT_FOUND
                );
            }
            const productDeletedResponse: ProductResponse =
                ProductDto.single(productDeleted);

            return productDeletedResponse;
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
