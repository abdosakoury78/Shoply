import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductsService } from '../../Services/products.service';
import { Product } from '../../Interfaces/products.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';
import { Cart } from '../../Interfaces/cart.interface';

@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  product!: Product;
  quantity: number = 1;
  productCount: number = 0;
  cartItems : Cart | null = null;
  constructor(private productService : ProductsService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              private router: Router,
              private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');


      if (!productId) return;

      this.productService.getProductById(productId).subscribe({
        next: (res) => {
          this.product = res.data;
          this.cdr.detectChanges(); // Trigger change detection to update the view
        },
        error: (err) => {
          console.log(err);
        }
      });
    });

    this.cartService.getCartProducts().subscribe({
      next: ({data}) => {
        this.cartItems = data;
      }
    })

    this.cartService.getCartCount().subscribe((count) => {
      this.productCount = count;
    });
  }

  addToCart(count : number) {

    if (this.cartItems && this.cartItems.products.find(p => p.product._id === this.product._id)) {

      this.productCount += count;

      this.cartService.updateQuantity(this.product._id, this.productCount).subscribe({
        next: ({data}) => {
          this.cartService.updateCartCount(count, true);
        }
      })
    } else {

      this.productCount += count;

      this.cartService.addProductToCart(this.product._id).subscribe({
        next: (res) => {
          this.cartService.updateCartCount(count, true);

          if(count > 1) {
            this.cartService.updateQuantity(this.product._id, this.productCount).subscribe({
              next: ({data}) => {
                this.cartItems = data;
              }
            })
          }

        }
      })
    }
  }

  increaseQuantity(){
    this.quantity++;
  }
  decreaseQuantity() {
    if(this.quantity>1){
      this.quantity--;
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
