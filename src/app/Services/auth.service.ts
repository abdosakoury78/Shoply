import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';

@Service()
export class AuthService {
    private readonly apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    signup(data: any) {
        return this.http.post(`${this.apiUrl}auth/signup`, data);
    }
}
