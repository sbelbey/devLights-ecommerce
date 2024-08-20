import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { Product } from "../product/model";
import { User } from "../user/model";

class CartItem {
    @prop({ ref: () => Product, required: true })
    product!: Ref<Product>;

    @prop({ type: Number, default: 1 })
    quantity!: number;
}

export class Cart {
    @prop({ type: () => [CartItem], default: [] })
    products!: CartItem[];

    @prop({ type: Date, default: Date.now })
    createdAt!: Date;

    @prop({ type: Date, default: Date.now })
    updatedAt!: Date;

    @prop({ type: Date, default: Date.now })
    deletedAt!: Date;

    @prop({ ref: () => User, required: true })
    owner!: Ref<User>;
}
