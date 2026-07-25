import { Component, inject, signal } from '@angular/core';
import { CategoriesService } from '../../Services/categories.service';
import { category } from '../../Interfaces/categories.interface';
import { ProductsService } from '../../Services/products.service';
import { Product } from '../../Interfaces/products.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

   private readonly CategoriesService = inject(CategoriesService);
    private readonly ProductsService = inject(ProductsService);


  categories = signal<category[]>([]);
  products = signal<Product[]>([]);


  ngOnInit(): void {
    this.CategoriesService.getAllCetegories().subscribe({
      next: ({ data}) => {
        this.categories.set(data.slice(0,4))
        
      },
      error: ({err}) =>{
        console.log(err);  
      }
      
    })

        this.ProductsService.getAllProducts().subscribe({
       next: ({ data}) => {
        this.products.set(data.slice(0,4))
        
      },
      error: ({err}) =>{
        console.log(err);  
      }
    })
  }
}
