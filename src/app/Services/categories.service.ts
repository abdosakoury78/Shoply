import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CategoriesResponse } from '../Interfaces/categories.interface';

@Service()
export class CategoriesService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    getAllCetegories(): Observable<CategoriesResponse>{
        return this.http.get<CategoriesResponse>(`${this.apiUrl}/categories`)
    }
}
