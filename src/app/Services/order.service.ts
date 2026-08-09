import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
<<<<<<< HEAD
import { Observable } from 'rxjs';
import { Orders } from '../Interfaces/order.interface';
import { environment } from '../../environments/environment.development';

@Service()
export class OrderService {
    private readonly httpClient = inject(HttpClient);

  getuserOrders(userId: string): Observable<Orders[]> {
    return this.httpClient.get<Orders[]>(
      `${environment.apiUrl}/orders/user/${userId}`
    );
  }
=======
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CheckoutResponse } from '../Interfaces/order.interface';

@Service()
export class OrderService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    checkoutSession(cartId: string, formData: FormGroup) : Observable<CheckoutResponse> {
        const returnUrl = 'http://localhost:4200/';
        return this.http.post<CheckoutResponse>(`${this.baseUrl}orders/checkout-session/${cartId}?url=${returnUrl}`, {formData}, {
            headers: {
                token: localStorage.getItem('userToken') || ''
            }
        });
    }
>>>>>>> 9dc956ac5a3f25f00b120682ce254d7f4cdc117e
}
