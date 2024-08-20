import { Request } from "express";
import { DocumentType } from "@typegoose/typegoose";
import HTTP_STATUS from "../../constants/HttpStatus";
import AuditData from "../../utils/AuditData.utils";
import HttpError from "../../utils/HttpError.utils";
import { CategoryCreateFields, CategoryResponse } from "./interface";
import CategoryRepository from "./repository";
import { CategoryModel } from "../processingModels";
import { Category } from "./model";
import CategoryDAO from "./dao";
import CategoryDto from "./dto";

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

            const categoryWithAuditData = AuditData.addCreateData(
                req,
                category
            );

            const categoryPayload: Category = new CategoryModel(
                categoryWithAuditData
            );

            const categoryCreated: DocumentType<Category> =
                await CategoryDAO.create(categoryPayload);

            const categoryCleaned: CategoryResponse =
                CategoryDto.single(categoryCreated);

            return categoryCleaned;
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
            const categoryFound: DocumentType<Category> | null =
                await CategoryDAO.getById(categoryId);

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
            const categoriesFound: DocumentType<Category>[] =
                await CategoryDAO.getAll();

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
