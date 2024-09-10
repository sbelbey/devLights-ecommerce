// MODELS
import CategoryModel from "./model";

/**
 * Provides functionality for interacting with the Category model in the database.
 */
export default class CategoryRepository {
    /**
     * Finds a Category by its name.
     * @param name - The name of the Category to find.
     * @returns The found Category, or `null` if no Category with the given name exists.
     */
    static async findByName(name: string) {
        const categoryFound = await CategoryModel.findOne({ name });
        return categoryFound;
    }
}
