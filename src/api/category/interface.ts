// LIBRARIES
import { Types } from "mongoose";

export interface ICategory {
    _id: Types.ObjectId;
    name: string;
    description: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: Types.ObjectId;
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
