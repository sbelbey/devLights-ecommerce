import { model, Schema } from "mongoose";
import { UserRole } from "../../constants/UserRole.constants";

const userCollection = "User";

/**
 * Defines the schema for the User model in the application. This schema includes the following fields:
 * - `firstName`: The first name of the user, required.
 * - `lastName`: The last name of the user, required.
 * - `email`: The email address of the user, required, unique, and must be a valid email format.
 * - `password`: The password of the user, required.
 * - `role`: The role of the user, which can be one of the values defined in the `UserRole` enum, with a default of `UserRole.USER`.
 * - `createdAt`: The date and time when the user was created, with a default of the current date and time.
 * - `updatedAt`: The date and time when the user was last updated, with a default of the current date and time.
 * - `resetToken`: A token used for password reset, with a default of an empty string.
 * - `resetTokenExpires`: The expiration time of the reset token, with a default of 0.
 * - `isActive`: A flag indicating whether the user is active, with a default of `true`.
 */
const UserSchema = new Schema({
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    resetToken: { type: String, default: "" },
    resetTokenExpires: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
});

const UserModel = model(userCollection, UserSchema);

export default UserModel;
