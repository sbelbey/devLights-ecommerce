import mongoose, { PaginateModel, Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
export const productCollection = "Product";

interface IProduct extends Document {
    title: string;
    description: string;
    code: string;
    price: number;
    stock: number;
    category: mongoose.Types.ObjectId;
    isNew: boolean;
    isAvailable: boolean;
    status: boolean;
    thumbnail: string[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    isNew: { type: Boolean, required: true, default: true },
    isAvailable: { type: Boolean, required: true, default: true },
    status: { type: Boolean, default: true },
    thumbnail: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

ProductSchema.plugin(mongoosePaginate);

const ProductModel = model<IProduct, PaginateModel<IProduct>>(
    productCollection,
    ProductSchema
);

export default ProductModel;
