import { Product } from './products.interface';

export interface CartResponse {
  status: string;
  numOfCartItems: number;
  cartId: string;
  data: Cart;
}

export interface Cart {
  _id: string;
  cartOwner: string;
  products: CartProduct[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

export interface CartProduct {
  _id: string;
  count: number;
  price: number;
  product: Product;
}