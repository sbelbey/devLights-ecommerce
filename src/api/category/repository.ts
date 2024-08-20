import { CategoryModel } from "../processingModels";

export default class CategoryRepository {
    static async findByName(name: string) {
        const categoryFound = await CategoryModel.findOne({ name });
        return categoryFound;
    }
}
