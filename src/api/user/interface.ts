import { Schema } from "mongoose";

export interface IUser {
    _id: Schema.Types.ObjectId;
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
}

export interface UserCreateFields {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
}

export interface UserResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export interface UserLoginFields {
    email: string;
    password: string;
}
