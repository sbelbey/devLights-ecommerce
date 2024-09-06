// LIBRARIES
import { model, Schema } from "mongoose";
// INTERFACES
import { IUser } from "./interface";
// CONSTANTS
import { UserRole } from "../../constants/UserRole.constants";

const userCollection = "User";

export const UserSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
            "Please fill a valid email",
        ],
    },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: UserRole,
        default: UserRole.USER,
    },
    cart: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    resetToken: { type: String, default: "" },
    resetTokenExpires: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    avatarUrl: { type: String, default: "" },
});

const UserModel = model(userCollection, UserSchema);

export default UserModel;
