// INTERFACES
import { ICategory } from "./interface";
// MODELS
import CategoryModel from "./model";

/**
 * Provides data access operations for managing categories.
 */
class CategoryDAO {
    /**
     * Creates a new category in the database.
     * @param category - The partial category object to create.
     * @returns The created category object.
     */
    static async create(category: Partial<ICategory>): Promise<ICategory> {
        return await CategoryModel.create(category);
    }

    /**
     * Retrieves all categories from the database.
     * @returns A Promise that resolves to an array of all category objects.
     */
    static async getAll(): Promise<ICategory[]> {
        return await CategoryModel.find();
    }

    /**
     * Retrieves a category from the database by its unique identifier.
     * @param id - The unique identifier of the category to retrieve.
     * @returns A Promise that resolves to the category object if found, or null if not found.
     */
    static async getById(id: string): Promise<ICategory | null> {
        return await CategoryModel.findById(id);
    }

    /**
     * Updates an existing category in the database.
     * @param id - The unique identifier of the category to update.
     * @param category - The updated category object.
     * @returns A Promise that resolves to the updated category object if successful, or null if the category was not found.
     */
    static async update(
        id: string,
        category: ICategory
    ): Promise<ICategory | null> {
        return await CategoryModel.findByIdAndUpdate(id, category, {
            new: true,
        });
    }

    /**
     * Deletes a category from the database by its unique identifier.
     * @param id - The unique identifier of the category to delete.
     * @returns A Promise that resolves to the deleted category object if successful, or null if the category was not found.
     */
    static async delete(id: string): Promise<ICategory | null> {
        return await CategoryModel.findByIdAndDelete(id);
    }
}

export default CategoryDAO;
