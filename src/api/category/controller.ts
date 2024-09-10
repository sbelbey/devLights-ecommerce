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

/**
 * Provides controller methods for managing categories.
 */
export default class CategoryController {
    /**
     * Creates a new category.
     *
     * @param req - The Express request object.
     * @param res - The Express response object.
     * @returns A Promise that resolves to the created category.
     */
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

    /**
     * Retrieves categories from the database.
     *
     * If a `categoryId` query parameter is provided, it will retrieve a single category by its ID.
     * Otherwise, it will retrieve all categories.
     *
     * @param req - The Express request object, containing the `categoryId` query parameter.
     * @param res - The Express response object, which will be used to send the retrieved categories.
     * @returns A Promise that resolves to the retrieved categories.
     */
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
