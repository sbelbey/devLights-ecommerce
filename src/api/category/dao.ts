// INTERFACES
import { ICategory } from "./interface";
// MODELS
import CategoryModel from "./model";

class CategoryDAO {
    static async create(category: Partial<ICategory>): Promise<ICategory> {
        return await CategoryModel.create(category);
    }

    static async getAll(): Promise<ICategory[]> {
        return await CategoryModel.find();
    }

    static async getById(id: string): Promise<ICategory | null> {
        return await CategoryModel.findById(id);
    }

    static async update(
        id: string,
        category: ICategory
    ): Promise<ICategory | null> {
        return await CategoryModel.findByIdAndUpdate(id, category, {
            new: true,
        });
    }

    static async delete(id: string): Promise<ICategory | null> {
        return await CategoryModel.findByIdAndDelete(id);
    }
}

export default CategoryDAO;
