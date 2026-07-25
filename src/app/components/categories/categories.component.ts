import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../Services/categories.service';
import { category } from '../../Interfaces/categories.interface';


@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit{
   private readonly CategoriesService = inject(CategoriesService);

  categories = signal<category[]>([]);

  ngOnInit(): void {
    this.CategoriesService.getAllCetegories().subscribe({
      next: ({ data}) => {
        this.categories.set(data)
        
      },
      error: ({err}) =>{
        console.log(err);  
      }
      
    })


  }
}
