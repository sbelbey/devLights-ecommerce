import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { UserRole } from "../../constants/UserRole.constants";
import { Cart } from "../cart/model";

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
    email!: string;

    @prop({ required: true })
    password!: string;

    @prop({
        enum: UserRole,
        default: UserRole.USER,
    })
    role!: UserRole;

    @prop({
        type: String,
        default: "",
        required: false,
    })
    resetToken!: string;

    @prop({
        type: Number,
        default: 0,
        required: false,
    })
    resetTokenExpires!: number;

    @prop({ type: Boolean, default: true })
    isActive!: boolean;

    @prop({ type: Date, default: Date.now })
    createdAt!: Date;

    @prop({ type: Date, default: Date.now })
    updatedAt!: Date;
}
