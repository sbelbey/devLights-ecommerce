export interface CategoryCreateFields {
    name: string;
    description: string;
    status: boolean;
    subCategory?: string[];
}

export interface CategoryResponse {
    id: string;
    name: string;
    description: string;
    status: boolean;
    subCategory: string[];
    createdAt: Date;
    updatedAt: Date;
}
