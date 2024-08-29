import { create } from "domain";
import { model, Schema } from "mongoose";

const categoryCollection = "Category";

const CategorySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const CategoryModel = model(categoryCollection, CategorySchema);

export default CategoryModel;
