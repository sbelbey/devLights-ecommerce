// INTERFACES
import { CategoryResponse } from "./interface";
import { ICategory } from "./interface";

/**
 * Provides utility functions for converting `ICategory` objects to `CategoryResponse` objects.
 *
 * The `single()` function takes an `ICategory` object and returns a `CategoryResponse` object with the relevant properties.
 * The `multiple()` function takes an array of `ICategory` objects and returns an array of `CategoryResponse` objects.
 */
export default class CategoryDto {
    /**
     * Converts an `ICategory` object to a `CategoryResponse` object, containing the relevant properties.
     *
     * @param category - The `ICategory` object to be converted.
     * @returns A `CategoryResponse` object with the `id`, `name`, `description`, `status`, `createdAt`, and `updatedAt` properties.
     */
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

    /**
     * Converts an array of `ICategory` objects to an array of `CategoryResponse` objects, containing the relevant properties.
     *
     * @param categories - An array of `ICategory` objects to be converted.
     * @returns An array of `CategoryResponse` objects with the `id`, `name`, `description`, `status`, `createdAt`, and `updatedAt` properties.
     */
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
