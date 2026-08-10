import { Product } from './products.interface';

export interface WishlistResponse {
  status: string;
  count: number;
  data: Product[];
}

export interface RemoveWishlistResponse {
  status: string;
  message: string;
  data: string[];
}