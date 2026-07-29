import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrls: [
    '../signup/signup.component.css', 
    './signin.component.css'  
  ]
})
export class SigninComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string>('');
  showPassword = signal<boolean>(false);

  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  togglePasswordVisibility() {
    this.showPassword.update(prev => !prev);
  }

  onSubmit() {
    if (this.signinForm.invalid) return;

    this.authService.signIn(this.signinForm.value).subscribe({
      next: (response) => {
        if (response.token) {
          localStorage.setItem('userToken', response.token);
        }
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Invalid email or password');
      }
    });
  }
}
