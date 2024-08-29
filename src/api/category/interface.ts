import { Schema } from "mongoose";
import { IUser } from "../user/interface";

export interface ICategory {
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: IUser | string;
}

export interface CategoryCreateFields {
    name: string;
    description: string;
    status: boolean;
}

export interface CategoryResponse {
    id: string;
    name: string;
    description: string;
    status: boolean;

    createdAt: Date;
    updatedAt: Date;
}
