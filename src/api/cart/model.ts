import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { Product } from "../product/model";

class CartItem {
    @prop({ ref: () => Product, required: true })
    product!: Ref<Product>;

    @prop({ type: Number, default: 1 })
    quantity!: number;
}

export class Cart {
    @prop({ type: () => [CartItem], default: [] })
    products!: CartItem[];
}

export const CartModel = getModelForClass(Cart);
