import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckoutResponse, Orders } from '../Interfaces/order.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        token: localStorage.getItem('userToken') || ''
      })
    };
  }

  // جلب طلبات المستخدم
  getuserOrders(userId: string): Observable<Orders[]> {
    return this.httpClient.get<Orders[]>(
      `${this.baseUrl}/orders/user/${userId}`
    );
  }

  // جلسة الدفع
  checkoutSession(cartId: string, formData: any): Observable<CheckoutResponse> {
    const returnUrl = 'http://localhost:4200/';
    return this.httpClient.post<CheckoutResponse>(
      `${this.baseUrl}/orders/checkout-session/${cartId}?url=${returnUrl}`,
      formData,
      this.getHeaders()
    );
  }
}