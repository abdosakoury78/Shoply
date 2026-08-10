import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartResponse } from '../Interfaces/cart.interface';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;
    private readonly subject = new BehaviorSubject<number>(0);

    getCartCount(): Observable<number> {
        return this.subject.asObservable();
    }

    loadCartCount(): void {
        this.getCartProducts().subscribe({
            next: (res) => {
                let totalCount = 0;
                res.data.products.forEach((product) => {
                    totalCount += product.count;
                });
                this.subject.next(totalCount);
            }
        });
    }
    updateCartCount(count: number, isDelta: boolean = true): void {
        if (isDelta) {
            const currentCount = this.subject.getValue();
            this.subject.next(Math.max(0, count + currentCount));
        } else {

            this.subject.next(count);
        }
    }

    getCartProducts():Observable<CartResponse>{
        return this.http.get<CartResponse>(`${this.apiUrl}/cart`);
    }

    addProductToCart(productId:string){
        return this.http.post(`${this.apiUrl}/cart`,{productId});
    }

    updateQuantity(productId:string , count:number):Observable<CartResponse>{
        return this.http.put<CartResponse>(`${this.apiUrl}/cart/${productId}`,{count});
    }

    removeCartItem(productId:string):Observable<CartResponse>{
        return this.http.delete<CartResponse>(`${this.apiUrl}/cart/${productId}`);
    }

    clearCart(){
        return this.http.delete(`${this.apiUrl}/cart`);
    }
}