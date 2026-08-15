import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { RemoveWishlistResponse, WishlistResponse } from '../Interfaces/wishlist.interface';

@Service()
export class WishlistService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;
    private readonly subject = new BehaviorSubject<number>(0);

    getWishListCount(): Observable<number> {
        return this.subject.asObservable();
    }

    loadWishListCount(): void {
        this.getWishlistProducts().subscribe({
            next: (res) => {
                this.subject.next(res.data.length);
            }
        });
    }

    getWishlistProducts():Observable<WishlistResponse>{
        return this.http.get<WishlistResponse>(`${this.apiUrl}/wishlist`);
    }

    addProductToWishlist(productId:string){
        const value = this.subject.value;
        this.subject.next(value + 1);
        return this.http.post(`${this.apiUrl}/wishlist`,{productId});
    }

    removeProduct(productId:string):Observable<RemoveWishlistResponse>{
        const value = this.subject.value;
        this.subject.next(value - 1);
        return this.http.delete<RemoveWishlistResponse>(`${this.apiUrl}/wishlist/${productId}`);
    }
}
