// LIBRARIES
import { Request, Response } from "express";
// INTERFACES
import { CategoryCreateFields, CategoryResponse } from "./interface";
// SERVICES
import CategoryService from "./service";
// UTILS
import apiResponse from "../../utils/apiResponse.utils";
import HttpError from "../../utils/HttpError.utils";
// CONSTANTS
import HTTP_STATUS from "../../constants/HttpStatus";

export default class CategoryController {
    static async createCategory(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const categoryData: CategoryCreateFields = req.body;

            const category: CategoryResponse =
                await CategoryService.createCategory(
                    req.body.user,
                    categoryData
                );

            const response = apiResponse(true, category);
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

    static async getCategories(req: Request, res: Response): Promise<Response> {
        try {
            const categoryId: string | undefined = req.query.id as string;

            let category: CategoryResponse | CategoryResponse[] | null = null;

            if (categoryId) {
                category = await CategoryService.getCategory(categoryId);
            } else {
                category = await CategoryService.getCategories();
            }

            const response = apiResponse(true, category);

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
