import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
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
}
