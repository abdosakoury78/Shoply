import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { RemoveWishlistResponse, WishlistResponse } from '../Interfaces/wishlist.interface';

@Service()
export class WishlistService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;


    getWishlistProducts():Observable<WishlistResponse>{
        return this.http.get<WishlistResponse>(`${this.apiUrl}/wishlist`);
    }

    addProductToWishlist(productId:string){
        return this.http.post(`${this.apiUrl}/wishlist`,{productId});
    }

    removeProduct(productId:string):Observable<RemoveWishlistResponse>{
        return this.http.delete<RemoveWishlistResponse>(`${this.apiUrl}/wishlist/${productId}`);
    }
}
