import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage = signal<string>('');
  showPassword = signal<boolean>(false);
  showRePassword = signal<boolean>(false);

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),

    email: new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/)]),

    rePassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordsMatch });

  passwordsMatch(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    return password === rePassword ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.signupForm.invalid) return;


    this.authService.signup(this.signupForm.value).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/signin']);
      },

      error: (err) => {
        this.errorMessage.set(err.error.message);
        console.log(this.errorMessage);
      }
    });
  }
}
