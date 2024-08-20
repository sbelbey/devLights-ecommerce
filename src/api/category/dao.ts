import { DocumentType } from "@typegoose/typegoose";
import { Category } from "./model";
import { CategoryModel } from "../processingModels";

/*
 * Class representing the Data Access Objetc (DAO) for categories.
 */
class CategoryDAO {
    /**
     * Creates a new Category in the database.
     * @param {Category} Category - The Category to create.
     * @returns {Promise<DocumentType<Category>>} - A Promise that resolves to the created Category.
     */
    static async create(Category: Category): Promise<DocumentType<Category>> {
        return await CategoryModel.create(Category);
    }

    /**
     * Retrieves all Categorys in the database
     * @returns {Promise<DocumentType<Category>[]>} - A Promise that resolves to an array of Categorys.
     */
    static async getAll(): Promise<DocumentType<Category>[]> {
        return await CategoryModel.find();
    }

    /**
     * Retrieves a Category by its ID
     * @param {string} id - The ID of the Category to retrieve.
     * @returns {Promise<DocumentType<Category> | null>} - A Promise that resolves to the Category or null if not found.
     */
    static async getById(id: string): Promise<DocumentType<Category> | null> {
        return await CategoryModel.findById(id);
    }

    /**
     * Updates a Category by its ID
     * @param {string} id - The ID of the Category to update.
     * @param {Category} Category - The updated Category object.
     * @returns {Promise<DocumentType<Category> | null>} - A Promise that resolves to the updated Category or null if not found.
     */
    static async update(
        id: string,
        Category: Category
    ): Promise<DocumentType<Category> | null> {
        return await CategoryModel.findByIdAndUpdate(id, Category, {
            new: true,
        });
    }

    /**
     * Deletes a Category by its ID
     * @param {string} id - The ID of the Category to delete.
     * @returns {Promise<DocumentType<Category> | null>} - A Promise that resolves to the deleted Category or null if not found.
     */
    static async delete(id: string): Promise<DocumentType<Category> | null> {
        return await CategoryModel.findByIdAndDelete(id);
    }
}

export default CategoryDAO;
