import { Component, inject, OnInit, signal } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { Cart } from '../../Interfaces/cart.interface';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {

  private readonly _CartService = inject(CartService);

  cartItems = signal<Cart | null>(null);
  cartCount = signal(0);
  cartId = signal<string | null>(null);

  ngOnInit(): void {
    this._CartService.getCartProducts().subscribe({
      next: ({ data }) => {
        this.cartItems.set(data);
        this.cartId.set(data?._id || null);
      },
      error: (err) => {
        console.log(err);
      }
    });

    this._CartService.getCartCount().subscribe((count) => {
      this.cartCount.set(count);
    });
  }

  updateQuantity(productId: string, count: number, action: string): void {
    this._CartService.updateQuantity(productId, count).subscribe({
      next: ({ data }) => {
        this.cartItems.set(data);
        if (action === 'increase') {
          this._CartService.updateCartCount(1, true);
        } else {
          this._CartService.updateCartCount(-1, true);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  removeCartItem(productId: string, count: number): void {
    this._CartService.removeCartItem(productId).subscribe({
      next: ({ data }) => {
        this.cartItems.set(data);
        this._CartService.updateCartCount(-count, true);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  clearCart(): void {
    this._CartService.clearCart().subscribe({
      next: () => {
        this.cartItems.set(null);
        this._CartService.updateCartCount(-this.cartCount(), true);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}