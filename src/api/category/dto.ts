// INTERFACES
import { CategoryResponse } from "./interface";
import { ICategory } from "./interface";

export default class CategoryDto {
    static single(category: ICategory): CategoryResponse {
        return {
            id: category._id.toString(),
            name: category.name,
            description: category.description,
            status: category.status,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        };
    }

    static multiple(categories: ICategory[]): CategoryResponse[] {
        return categories.map((category) => {
            return {
                id: category._id.toString(),
                name: category.name,
                description: category.description,
                status: category.status,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
            };
        });
    }
}
