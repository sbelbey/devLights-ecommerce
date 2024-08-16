import { prop, getModelForClass } from "@typegoose/typegoose";

export const productCollection = "products";

export class Product {
    @prop({ required: true })
    title!: string;

    @prop({ required: true })
    description!: string;

    @prop({ required: true })
    code!: string;

    @prop({ required: true, min: 0, double: true })
    price!: number;

    @prop({ required: true, min: 0, integer: true })
    stock!: number;

    @prop({ required: true })
    category!: string;

    @prop({ required: true, default: true })
    isNew!: boolean;

    @prop({ required: true, default: true })
    isAvailable!: boolean;

    @prop({ default: true })
    status!: boolean;

    @prop({ type: () => [String], default: [] })
    thumbnail!: string[];
}

export const ProductModel = getModelForClass(Product);
