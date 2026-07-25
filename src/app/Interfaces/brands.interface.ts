export interface BrandsResponse{
    data: Brand[];
}

export interface Brand {
    _id: string;
    name: string;
    slug: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}
