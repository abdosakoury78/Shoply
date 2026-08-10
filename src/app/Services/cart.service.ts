import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartResponse } from '../Interfaces/cart.interface';

@Service()
export class CartService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;
    private readonly subject = new BehaviorSubject<number>(0);


    getCartCount():Observable<number>{
        return this.subject.asObservable();
    }

    loadCartCount() {
        this.getCartProducts().subscribe({
            next: (res) => {
                res.data.products.forEach((product) => {
                    this.subject.next(this.subject.getValue() + product.count);
                })
            }
        })
    }

    updateCartCount(count:number, error:boolean = false){
        if(error) {
            const currentCount = this.subject.getValue();
            this.subject.next(count + currentCount);
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
