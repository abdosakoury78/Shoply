import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';


@Service()
export class AuthService {
    private readonly apiUrl = environment.apiUrl;
    private http = inject(HttpClient);
    private router =inject(Router);

    signup(data: any) {
        return this.http.post(`${this.apiUrl}auth/signup`, data);
    }

    signIn(data: object): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signin`, data);
}

   verifyToken():Observable<any>{
    let token =localStorage.getItem('userToken')!
     return this.http.get(`${this.apiUrl}/auth/verifyToken`,{
        headers:{
        token:token
        }
     })
   }

  saveUserData(){
    let token =localStorage.getItem('userToken')
    if(token){
        try{
        let decode = jwtDecode(token)
        console.log(decode)
        this.verifyToken().subscribe({
            next:(res)=> {
                console.log('Token Is Verfied By Server ',res)
            },
            error:(err) =>{
                console.log('Token Invalid')
                this.router.navigate(['signin'])
                localStorage.clear()
            },
        })
        }
        catch{
        this.router.navigate(['signin'])
        localStorage.clear()
        }
    }
    else{
         this.router.navigate(['signin'])
        localStorage.clear()
    }
  }

}
