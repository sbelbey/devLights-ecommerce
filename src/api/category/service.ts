import { Request } from "express";
import { Document } from "mongoose";
import HTTP_STATUS from "../../constants/HttpStatus";
import AuditData from "../../utils/AuditData.utils";
import HttpError from "../../utils/HttpError.utils";
import { CategoryCreateFields, CategoryResponse } from "./interface";
import CategoryRepository from "./repository";
import { ICategory } from "./interface";
import CategoryDAO from "./dao";
import CategoryDto from "./dto";
import CategoryModel from "./model";

export default class CategoryService {
    static async createCategory(
        req: Request,
        category: CategoryCreateFields
    ): Promise<CategoryResponse> {
        try {
            const categoryFound = await CategoryRepository.findByName(
                category.name
            );

            if (categoryFound) {
                throw new HttpError(
                    "Category already exists",
                    "CATEGORY_ALREADY_EXISTS",
                    HTTP_STATUS.CONFLICT
                );
            }

            const categoryWithAuditData: Partial<ICategory> =
                AuditData.addCreateData(req, category);

            const categoryCreated = await CategoryDAO.create(
                categoryWithAuditData
            );

            // const categoryCleaned: CategoryResponse =
            //     CategoryDto.single(categoryCreated);

            return categoryCreated as unknown as CategoryResponse;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.description || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );

            throw error;
        }
    }

    static async getCategory(categoryId: string): Promise<CategoryResponse> {
        try {
            const categoryFound: ICategory | null = await CategoryDAO.getById(
                categoryId
            );

            if (!categoryFound) {
                throw new HttpError(
                    "Category not found",
                    "The category with the given ID was not found.",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const category: CategoryResponse =
                CategoryDto.single(categoryFound);
            return category;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.desciption || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );
            throw error;
        }
    }

    static async getCategories(): Promise<CategoryResponse[]> {
        try {
            const categoriesFound: ICategory[] = await CategoryDAO.getAll();

            if (!categoriesFound || !categoriesFound.length) {
                throw new HttpError(
                    "Categories not found",
                    "CATEGORIES_NOT_FOUND",
                    HTTP_STATUS.NOT_FOUND
                );
            }

            const categories: CategoryResponse[] =
                CategoryDto.multiple(categoriesFound);

            return categories;
        } catch (err: any) {
            const error: HttpError = new HttpError(
                err.desciption || err.message,
                err.details || err.message,
                err.status || HTTP_STATUS.SERVER_ERROR
            );
            throw error;
        }
    }
}
