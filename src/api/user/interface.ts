// LIBRARIES
import { Types } from "mongoose";
// INTERFACES
import { ICart } from "../cart/interface";

export interface IUser {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    resetToken: string;
    resetTokenExpires: number;
    isActive: boolean;
    cart: Types.ObjectId;
    avatarUrl: string;
}

export interface UserCreateFields {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
    avatarUrl?: string;
}

export interface UserResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    cart?: Types.ObjectId | ICart;
    avatarUrl?: string;
}

export interface UserLoginFields {
    email: string;
    password: string;
}
