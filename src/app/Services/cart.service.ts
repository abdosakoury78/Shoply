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

    getCartProducts(): Observable<CartResponse> {
        return this.http.get<CartResponse>(`${this.apiUrl}/cart`, this.getHeaders());
    }

    addProductToCart(productId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/cart`, { productId }, this.getHeaders());
    }

    updateQuantity(productId: string, count: number): Observable<CartResponse> {
        return this.http.put<CartResponse>(`${this.apiUrl}/cart/${productId}`, { count }, this.getHeaders());
    }

    removeCartItem(productId: string): Observable<CartResponse> {
        return this.http.delete<CartResponse>(`${this.apiUrl}/cart/${productId}`, this.getHeaders());
    }

    clearCart(): Observable<any> {
        return this.http.delete(`${this.apiUrl}/cart`, this.getHeaders());
    }

    private getHeaders() {
        return {
            headers: new HttpHeaders({
                token: localStorage.getItem('userToken') || ''
            })
        };
    }

    checkoutSession(cartId: string, shippingAddress: object): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/orders/checkout-session/${cartId}?url=http://localhost:4200`,
            shippingAddress,
            this.getHeaders()
        );
    }

    createCashOrder(cartId: string, shippingAddress: object): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/orders/${cartId}`,
            shippingAddress,
            this.getHeaders()
        );
    }
}