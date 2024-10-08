// LIBRARIES
import { Request, Response } from "express";
// INTERFACES
import {
    ProductCreateFields,
    ProductFilteredResponse,
    ProductResponse,
    ProductUpdateFields,
} from "./interface";
import { MulterFiles } from "../../interfaces/file.interface";
// TYPES
import { ProductSearchParamsQuery } from "./types";
// SERVICES
import ProductServices from "./service";
// UTILS
import apiResponse from "../../utils/apiResponse.utils";
import HttpError from "../../utils/HttpError.utils";
// CONSTANTS
import HTTP_STATUS from "../../constants/HttpStatus";

/**
 * Handles the CRUD operations for products in the application.
 */
export default class ProductController {
    /**
     * Retrieves a product by its ID or a list of products based on search parameters.
     *
     * @param req - The Express request object containing the product search parameters.
     * @param res - The Express response object to send the product data.
     * @returns A Promise that resolves to the API response with the product data.
     */
    static async getProduct(req: Request, res: Response): Promise<Response> {
        try {
            const productSearchParams: ProductSearchParamsQuery = req.query;
            let productFound: ProductResponse | ProductFilteredResponse | null =
                null;

            if (productSearchParams.productId) {
                productFound = await ProductServices.findByProductId(
                    productSearchParams.productId
                );
            } else {
                productFound = await ProductServices.findProducts(
                    productSearchParams
                );
            }

            const response = apiResponse(true, productFound);

            return res.status(HTTP_STATUS.OK).json(response);
        } catch (err: any) {
            const response = apiResponse(
                false,
                new HttpError(
                    err.description || err.message,
                    err.details || err.message,
                    err.status || HTTP_STATUS.SERVER_ERROR
                )
            );
            return res
                .status(err.status || HTTP_STATUS.SERVER_ERROR)
                .json(response);
        }
    }

    /**
     * Creates a new product in the system.
     *
     * @param req - The Express request object containing the product creation payload.
     * @param res - The Express response object to send the created product data.
     * @returns A Promise that resolves to the API response with the created product data.
     */
    static async createProduct(req: Request, res: Response): Promise<Response> {
        try {
            const productPayload: ProductCreateFields = req.body;
            const productCreated: ProductResponse =
                await ProductServices.createProduct(
                    req.body.user,
                    productPayload
                );

            const response = apiResponse(true, productCreated);

            return res.status(HTTP_STATUS.CREATED).json(response);
        } catch (err: any) {
            const response = apiResponse(
                false,
                new HttpError(
                    err.description || err.message,
                    err.details || err.message,
                    err.status || HTTP_STATUS.SERVER_ERROR
                )
            );
            return res
                .status(err.status || HTTP_STATUS.SERVER_ERROR)
                .json(response);
        }
    }

    /**
     * Updates an existing product in the system.
     *
     * @param req - The Express request object containing the product update payload.
     * @param res - The Express response object to send the updated product data.
     * @returns A Promise that resolves to the API response with the updated product data.
     */
    static async updateProduct(req: Request, res: Response): Promise<Response> {
        try {
            const productPayload: ProductUpdateFields = req.body;
            const productId: string = req.params.id;
            const files = req.files as MulterFiles;
            const productCreated: ProductResponse =
                await ProductServices.updateProduct(
                    productId,
                    productPayload,
                    files
                );

            const response = apiResponse(true, productCreated);
            return res.status(HTTP_STATUS.CREATED).json(response);
        } catch (err: any) {
            const response = apiResponse(
                false,
                new HttpError(
                    err.description || err.message,
                    err.details || err.message,
                    err.status || HTTP_STATUS.SERVER_ERROR
                )
            );
            return res
                .status(err.status || HTTP_STATUS.SERVER_ERROR)
                .json(response);
        }
    }

    /**
     * Deletes an existing product from the system.
     *
     * @param req - The Express request object containing the product ID and user information.
     * @param res - The Express response object to send the deleted product data.
     * @returns A Promise that resolves to the API response with the deleted product data.
     */
    static async deleteProduct(req: Request, res: Response): Promise<Response> {
        try {
            const productId: string = req.params.id;
            const user: string = req.body.user;

            const productDeleted: ProductResponse =
                await ProductServices.deleteProduct(productId, user);

            const response = apiResponse(true, productDeleted);
            return res.status(HTTP_STATUS.OK).json(response);
        } catch (err: any) {
            const response = apiResponse(
                false,
                new HttpError(
                    err.description || err.message,
                    err.details || err.message,
                    err.status || HTTP_STATUS.SERVER_ERROR
                )
            );
            return res
                .status(err.status || HTTP_STATUS.SERVER_ERROR)
                .json(response);
        }
    }
}
