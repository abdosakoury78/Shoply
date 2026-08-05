import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductsService } from '../../Services/products.service';
import { Product } from '../../Interfaces/products.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  product!: Product;
  quantity: number = 1;
  constructor(private productService : ProductsService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');


      if (!productId) return;

      this.productService.getProductById(productId).subscribe({
        next: (res) => {
          this.product = res.data;
          this.cdr.detectChanges(); // Trigger change detection to update the view
          console.log('Product Data:', this.product); // Log the product data to the console
        },
        error: (err) => {
          console.log(err);
        }
      });
    });
  }

  addToCart(product : Product) {}

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
