export interface ProductResponse {
    id: string;
    title: string;
    description: string;
    code: string;
    price: number;
    stock: number;
    category: string;
    isNew: boolean;
    isAvailable: boolean;
    status: boolean;
    thumbnail: string[];
    createdBy: string;
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
