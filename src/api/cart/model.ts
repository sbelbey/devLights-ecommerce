import { model, Schema } from "mongoose";

const cartCollection = "Cart";

const CartSchema = new Schema({
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
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    deletedAt: { type: Date, required: true },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const CartModel = model(cartCollection, CartSchema);

export default CartModel;
