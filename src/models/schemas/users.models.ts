import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { UserRole } from "../../constants/UserRole.constants";
import { Cart } from "./carts.models";

export class User {
    @prop({ required: true })
    firstName!: string;

    @prop({ required: true })
    lastName!: string;

    @prop({
        required: true,
        unique: true,
        match: [
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
            "Please fill a valid email",
        ],
    })
    password!: string;

    @prop({
        enum: UserRole,
        default: UserRole.USER,
    })
    role!: UserRole;

    @prop({
        type: () => [Cart],
        ref: Cart,
    })
    cart!: Ref<Cart>[];

    @prop({
        type: String,
        default: "",
    })
    resetToken!: string;

    @prop({
        type: Number,
        default: 0,
    })
    resetTokenExpires!: number;
}

export const UserModel = getModelForClass(User);
