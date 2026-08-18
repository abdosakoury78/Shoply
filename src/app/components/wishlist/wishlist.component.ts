import { Component, inject, OnInit, signal } from '@angular/core';
import { WishlistService } from '../../Services/wishlist.service';
import { Product } from '../../Interfaces/products.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../../Services/cart.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoPipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly _WishlistService = inject(WishlistService);
  private readonly _CartService = inject(CartService);

  wishlistItems = signal<Product[]>([]);

  ngOnInit(): void {
    this._WishlistService.getWishlistProducts().subscribe({
      next: ({ data }) => {
        this.wishlistItems.set(data);
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  removeProduct(productId: string): void {
    this._WishlistService.removeProduct(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.wishlistItems.update(products =>
          products.filter(product => product._id !== productId)
        );
        this._WishlistService.updateWishListCount(false);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addToCart(productId: string): void {
    this._CartService.updateCartCount(1, true);
    this._CartService.addProductToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: 'Product Added To Cart',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: err.error?.message || 'Error occurred'
        });
      }
    });
  }
}