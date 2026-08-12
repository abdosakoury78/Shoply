import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Orders } from '../../Interfaces/order.interface';
import { OrderService } from '../../Services/order.service';
import { UserDetails } from '../../Interfaces/user-details.interface';
import { CurrencyEgpPipe } from '../../pipes/currency-egp-pipe';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [DatePipe, CurrencyEgpPipe, TranslocoPipe],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.css',
})
export class AllordersComponent implements OnInit {
  private readonly ordersService = inject(OrderService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  orders = signal<Orders[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');

      if (token) {
        const decodedToken = jwtDecode<UserDetails>(token);
        const userId = decodedToken.id;

        if (userId) {
          this.getUserOrders(userId);
        }
      } else {
        this.isLoading.set(false);
      }
    }
  }

  getUserOrders(userId: string): void {
    this.isLoading.set(true);
    this.ordersService.getuserOrders(userId).subscribe({
      next: (res) => {
        this.orders.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Fetch Orders Error:', err);
        this.isLoading.set(false);
      }
    });
  }
}