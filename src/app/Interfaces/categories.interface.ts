export interface CategoriesResponse {
    data:category[];
}

export interface category {
    _id: string;
    name: string;
    slug: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}
