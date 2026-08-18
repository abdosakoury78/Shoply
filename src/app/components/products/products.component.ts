import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../Services/products.service';
import { Product } from '../../Interfaces/products.interface';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { WishlistService } from '../../Services/wishlist.service';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { WishlistResponse } from '../../Interfaces/wishlist.interface';

@Component({
  selector: 'app-products',
  imports: [CommonModule, TranslocoPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  allProducts = signal<Product[]>([]);
  currentPage = signal(1);
  pageSize = 8;
  wishlist : Product[] | null = null;

  products = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.allProducts().slice(start, end);
  });

  totalPages = computed(() =>
    Math.ceil(this.allProducts().length / this.pageSize)
  );

  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe({
      next: ({ data }) => {
        this.allProducts.set(data);
        this.wishlistService.getWishlistProducts().subscribe({
          next: (res) => {
            this.wishlist = res.data;
            for (let product of this.wishlist) {
              this.allProducts.update(products =>
                products.map(p =>
                  p._id === product._id
                    ? { ...p, favAdded: true }
                    : p
                )
              );
            }
          }
        })
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addToCart(productId: string) {
    this.cartService.updateCartCount(1, true);
    this.cartService.addProductToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: this.translocoService.translate('products.cartSuccess'),
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: err.error?.message || this.translocoService.translate('products.errorOccurred')
        });
      }
    });
  }

  addProductToWishlist(productId: string) {
    const product = this.allProducts().filter(p => p._id === productId)[0];
    if(!product.favAdded) {
      this.wishlistService.addProductToWishlist(productId).subscribe({
        next: () => {
          this.allProducts.update(products =>
            products.map(p =>
              p._id === productId
                ? { ...p, favAdded: true }
                : p
            )
          );
          this.wishlistService.updateWishListCount(true);
          Swal.fire({
            icon: 'success',
            title: this.translocoService.translate('products.wishlistSuccess'),
            timer: 1500,
            showConfirmButton: true
          });
          // this.wishlistIcon.set(true);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: err.error?.message || this.translocoService.translate('products.errorOccurred')
          });
        }
      });
    }else {
          this.allProducts.update(products =>
            products.map(p =>
              p._id === productId
                ? { ...p, favAdded: false }
                : p
            )
          );
          this.wishlistService.removeProduct(productId).subscribe();
          this.wishlistService.updateWishListCount(false);
    }
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages()) return;

    this.currentPage.set(page);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  goToProduct(productId: string) {
    this.router.navigate(['/products', productId]);
  }
}