import { prop, getModelForClass } from "@typegoose/typegoose";

export const productCollection = "products";

export class Product {
    @prop({ required: true })
    title!: string;

    @prop({ required: true })
    description!: string;

    @prop({ required: true })
    code!: string;

    @prop({ required: true })
    price!: number;

    @prop({ required: true })
    stock!: number;

    @prop({ required: true })
    category!: string;

    @prop({ default: true })
    status!: boolean;

    @prop({ type: () => [String], default: [] })
    thumbnail!: string[];

    @prop({ default: "admin" })
    owner!: string;
}

export const ProductModel = getModelForClass(Product);
