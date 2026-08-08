import { Component, computed, inject, OnInit, signal, Signal } from '@angular/core';
import { ProductsService } from '../../Services/products.service';
import { Product } from '../../Interfaces/products.interface';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
   private readonly ProductsService = inject(ProductsService);
   private readonly CartService = inject(CartService);
   private readonly router = inject(Router);

  allProducts = signal<Product[]>([]);

  currentPage = signal(1);
  pageSize = 8;

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
    this.ProductsService.getAllProducts().subscribe({
      next: ({ data}) => {
        this.allProducts.set(data)

      },
      error: ({err}) =>{
        console.log(err);
      }

    })
  }

addToCart(productId: string){
  this.CartService.updateCartCount(1, true);
  this.CartService.addProductToCart(productId).subscribe({

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
        title: err.error.message
      });

    }

  });

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