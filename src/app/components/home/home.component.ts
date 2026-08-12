import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../Services/categories.service';
import { category } from '../../Interfaces/categories.interface';
import { ProductsService } from '../../Services/products.service';
import { Product } from '../../Interfaces/products.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

  private readonly categoriesService = inject(CategoriesService);
  private readonly productsService = inject(ProductsService);
  private readonly authService = inject(AuthService);

  categories = signal<category[]>([]);
  products = signal<Product[]>([]);

  constructor() {
    this.authService.saveUserData();
  }

  ngOnInit(): void {
    this.categoriesService.getAllCetegories().subscribe({
      next: ({ data }) => {
        this.categories.set(data.slice(0, 4));
      },
      error: (err) => {
        console.log(err);
      }
    });

    this.productsService.getAllProducts().subscribe({
      next: ({ data }) => {
        this.products.set(data.slice(0, 4));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}