import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../Services/products.service';
import { Product } from '../../Interfaces/products.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';
import { Cart } from '../../Interfaces/cart.interface';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { WishlistService } from '../../Services/wishlist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {

  private productService = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cartService = inject(CartService);
  private wishListService = inject(WishlistService);
  private translocoService = inject(TranslocoService);

  product = signal<Product | null>(null);

  quantity = signal(1);

  productCount = signal(0);

  cartItems = signal<Cart | null>(null);

  count = signal(0);


  ngOnInit(): void {

    // Get product
    this.route.paramMap.subscribe(params => {

      const productId = params.get('id');

      if (!productId) return;

      this.productService.getProductById(productId).subscribe({

        next: (res) => {
          this.product.set(res.data);
          console.log(this.product());
          this.wishListService.getWishlistProducts().subscribe({
            next: (res) => {
              if(res.data.find(p => p._id === this.product()?._id)) {
                this.product.update(pro => {
                  if(!pro) return pro;
                  return {
                    ...pro,
                    favAdded: true
                  };
                })
              }
            }
          })
          console.log(this.product()?.favAdded);

        },

        error: (err) => {
          console.log(err);
        }

      });

    });


    // Get cart products
    this.cartService.getCartProducts().subscribe({
      next: ({ data }) => {
        this.cartItems.set(data);
      }
    });

  }


  addToCart(quantity: number): void {

    const product = this.product();
    if (!product) return;

    const cart = this.cartItems();
    // Product already exists in cart
    if (
      cart &&
      cart.products.find(p => p.product._id === product._id)
    ) {
      const pro = cart.products.find(p => p.product._id === product._id);
      if(!pro) return;
      this.cartService
        .updateQuantity(product._id, pro?.count + quantity)
        .subscribe({
          next: ({ data }) => {
            this.cartService.updateCartCount(quantity, true);
            console.log(data);
          }
        });
    }
    // Product doesn't exist in cart
    else {
      this.count.update(count => count + quantity);
      console.log('Product count:', this.count());
      this.cartService
        .addProductToCart(product._id)
        .subscribe({
          next: () => {
            this.cartService.updateCartCount(quantity, true);
            // If user selected more than 1
            if (quantity > 1) {
              this.cartService
                .updateQuantity(product._id, this.count())
                .subscribe({
                  next: ({ data }) => {
                    console.log(data);
                  }
                });
            }
          }
        });
    }

              Swal.fire({
            icon: 'success',
            title: this.translocoService.translate('products.cartSuccess'),
            timer: 1500,
            showConfirmButton: true
          });
  }


  increaseQuantity(): void {
    const product = this.product();
    if (!product) return;
    this.quantity.update(current => {
      if (current < product.quantity) {
        return current + 1;
      }
      return current;
    });
  }


  decreaseQuantity(): void {
    this.quantity.update(current => {
      if (current > 1) {
        return current - 1;
      }
      return current;
    });
  }


  goBack(): void {
    this.router.navigate(['/products']);
  }

  addProductToWishlist() {
    if(!this.product()?.favAdded) {
      this.wishListService.addProductToWishlist(this.product()!._id).subscribe({
        next: () => {
          this.product.update(pro => {
                  if(!pro) return pro;
                  return {
                    ...pro,
                    favAdded: true
                  };
          })
          this.wishListService.updateWishListCount(true);
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
          this.product.update(pro => {
                  if(!pro) return pro;
                  return {
                    ...pro,
                    favAdded: false
                  };
          });
          this.wishListService.removeProduct(this.product()!._id).subscribe();
          this.wishListService.updateWishListCount(false);
    }
  }
}