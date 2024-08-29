import { Request, Response } from "express";
import {
    ProductCreateFields,
    ProductFilteredResponse,
    ProductResponse,
} from "./interface";
import ProductServices from "./service";
import apiResponse from "../../utils/apiResponse.utils";
import HTTP_STATUS from "../../constants/HttpStatus";
import HttpError from "../../utils/HttpError.utils";
import { ProductSearchParamsQuery } from "./types";

export default class ProductController {
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

    static async createProduct(req: Request, res: Response): Promise<Response> {
        try {
            const productPayload: ProductCreateFields = req.body;
            const productCreated: ProductResponse =
                await ProductServices.createProduct(productPayload, req);

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
}
