import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { BrandsResponse } from '../Interfaces/brands.interface';

@Service()
export class BrandsService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    getAllBrands(): Observable<BrandsResponse>{
        return this.http.get<BrandsResponse>(`${this.apiUrl}/brands`)
    }
}
