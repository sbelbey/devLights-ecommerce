type filterByPrice = "asc" | "desc";

export type ProductSearchParamsQuery = {
    productId?: string;
    limit?: string;
    page?: string;
    filterByPrice?: filterByPrice;
    category?: string;
    salersId?: string;
    priceRange?: string;
};
