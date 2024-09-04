// LIBRARIES
import { PaginateModel, Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
// INTERFACES
import { IProduct } from "./interface";

const productCollection = "Product";

const ProductSchema = new Schema<IProduct>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    isNew: { type: Boolean, required: true, default: true },
    isAvailable: { type: Boolean, required: true, default: true },
    status: { type: Boolean, default: true },
    thumbnail: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});

ProductSchema.plugin(mongoosePaginate);

const ProductModel = model<IProduct, PaginateModel<IProduct>>(
    productCollection,
    ProductSchema
);

export default ProductModel;
