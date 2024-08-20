import { DocumentType } from "@typegoose/typegoose";
import { CategoryResponse } from "./interface";
import { Category } from "./model";

export default class CategoryDto {
    static single(category: DocumentType<Category>): CategoryResponse {
        return {
            id: category._id.toString(),
            name: category.name,
            description: category.description,
            status: category.status,
            subCategory: category.subCategory.map((subCategory) =>
                subCategory.toString()
            ),
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        };
    }

    static multiple(categories: DocumentType<Category>[]): CategoryResponse[] {
        return categories.map((category) => {
            return {
                id: category._id.toString(),
                name: category.name,
                description: category.description,
                status: category.status,
                subCategory: category.subCategory.map((subCategory) =>
                    subCategory.toString()
                ),
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
            };
        });
    }
}
