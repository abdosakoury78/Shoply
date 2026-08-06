import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Product, ProductResponse, ProductsResponse } from '../Interfaces/products.interface';

@Service()
export class ProductsService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;


    getAllProducts(): Observable<ProductsResponse>{
        return this.http.get<ProductsResponse>(`${this.apiUrl}/products`);
    }

    getProductById(id : string) {
        return this.http.get<ProductResponse>(`${this.apiUrl}/products/${id}`);
    }
}
