import { Request, Response } from "express";
import { ProductCreateFields, ProductResponse } from "./interface";
import ProductServices from "./service";
import apiResponse from "../../utils/apiResponse.utils";
import HTTP_STATUS from "../../constants/HttpStatus";
import HttpError from "../../utils/HttpError.utils";

export default class ProductController {
    static async getProduct(req: Request, res: Response): Promise<Response> {
        try {
            //FIXME: Falta agregar - Añadir Paginado - Añadir Filtro - Añadir Búsqueda - Añadir Ordenamiento
            const productId: string | undefined = req.query.id as string;

            let productFound: ProductResponse | ProductResponse[] | null = null;

            if (productId) {
                productFound = await ProductServices.findByProductId(productId);
            } else {
                productFound = await ProductServices.findProducts();
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
