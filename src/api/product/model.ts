import { prop, Ref } from "@typegoose/typegoose";
import { User } from "../user/model";
import { Category } from "../category/model";

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

    @prop({ ref: () => Category, required: true })
    category!: Ref<Category>;

    @prop({ required: true, default: true })
    isNew!: boolean;

    @prop({ required: true, default: true })
    isAvailable!: boolean;

    @prop({ default: true })
    status!: boolean;

    @prop({ type: () => [String], default: [] })
    thumbnail!: string[];

    @prop({ type: Date, default: Date.now })
    createdAt!: Date;

    @prop({ type: Date, default: Date.now })
    updatedAt!: Date;

    @prop({
        ref: () => User,
    })
    createdBy!: Ref<User>;
}
