import mongoose, { Document } from "mongoose";
import { ICategory } from "../category/interface";
import { IUser } from "../user/interface";

export interface IProduct {
    _id: mongoose.Schema.Types.ObjectId;
    title: string;
    description: string;
    code: string;
    price: number;
    stock: number;
    category: ICategory | string;
    isNew: boolean;
    isAvailable: boolean;
    status: boolean;
    thumbnail: string[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: IUser | string;
}

export interface ProductResponse {
    id: string;
    title: string;
    description: string;
    code: string;
    price: number;
    stock: number;
    category: ICategory;
    isNew: boolean;
    isAvailable: boolean;
    status: boolean;
    thumbnail: string[];
    createdBy: string;
}

export interface ProductFilteredResponse {
    products: ProductResponse[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number | undefined;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | undefined | null;
    nextPage: number | undefined | null;
}

type filterByPrice = "lower" | "higher";

export interface ProductRequestParams {
    category?: string;
    salersId?: string;
    filterByPrice?: filterByPrice;
    priceRange?: string;
    page?: string;
    limit?: string;
    id?: string;
}

export interface ProductCreateFields {
    title: string;
    description: string;
    code: string;
    price: number;
    stock: number;
    category: string;
    isNew?: boolean;
    isAvailable?: boolean;
    status?: boolean;
    thumbnail?: string[];
}
