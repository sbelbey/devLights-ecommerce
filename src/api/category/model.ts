import { prop, getModelForClass, Ref } from "@typegoose/typegoose";

export const categoryCollection = "category";

class SubCategory {
    @prop({ required: true })
    name!: string;

    @prop({ required: true })
    description!: string;
}

export class Category {
    @prop({ required: true, unique: true })
    name!: string;

    @prop({ required: true })
    description!: string;

    @prop({ required: true, default: true })
    status!: boolean;

    @prop({ type: () => [SubCategory], ref: () => SubCategory, default: [] })
    subCategory!: Ref<SubCategory>[];

    @prop({ type: Date, default: Date.now })
    createdAt!: Date;

    @prop({ type: Date, default: Date.now })
    updatedAt!: Date;

    @prop({
        ref: () => "User",
    })
    createdBy!: Ref<"User">;
}
