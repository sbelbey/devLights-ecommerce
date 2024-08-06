import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { Product } from "./products.models";

export class Cart {
    @prop({
        type: () => [
            {
                product: {
                    type: () => String,
                    ref: Product,
                    required: true,
                },
                quantity: {
                    type: () => Number,
                    default: 1,
                },
            },
        ],
    })
    products!: Array<{
        product: Ref<Product>;
        quantity: number;
    }>;
}

export const CartModel = getModelForClass(Cart);
