import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
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
}
