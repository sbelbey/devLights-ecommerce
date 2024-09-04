// LIBRARIES
import { model, Schema } from "mongoose";
// INTERFACES
import { ICart } from "./interface";

const cartCollection = "Cart";

const CartSchema = new Schema<ICart>({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: false },
    deletedAt: { type: Date, required: false },
});

const CartModel = model(cartCollection, CartSchema);

export default CartModel;
