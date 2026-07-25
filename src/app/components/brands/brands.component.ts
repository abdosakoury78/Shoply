import { Component, computed, inject, signal } from '@angular/core';
import { BrandsService } from '../../Services/brands.service';
import { Brand } from '../../Interfaces/products.interface';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent {
   private readonly BrandsService = inject(BrandsService);

  allBrands = signal<Brand[]>([]);

  currentPage = signal(1);
  pageSize = 8;

  brands = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;

    return this.allBrands().slice(start, end);
  });

  totalPages = computed(() =>
    Math.ceil(this.allBrands().length / this.pageSize)
  );

  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  ngOnInit(): void {
    this.BrandsService.getAllBrands().subscribe({
      next: ({ data}) => {
        this.allBrands.set(data)
        
      },
      error: ({err}) =>{
        console.log(err);  
      }
      
    })
  }
  
   changePage(page: number) {
    if (page < 1 || page > this.totalPages()) return;

    this.currentPage.set(page);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
