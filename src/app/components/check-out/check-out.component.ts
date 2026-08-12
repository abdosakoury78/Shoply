import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartResponse } from '../../Interfaces/cart.interface';
import { CartService } from '../../Services/cart.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslocoPipe],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css',
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  cartDetails = signal<CartResponse>({} as CartResponse);
  cartId = signal<string>('');
  flag = signal<string>('cash');
  isLoading = signal<boolean>(false);

  checkOut: FormGroup = this.formBuilder.group({
    shippingAddress: this.formBuilder.group({
      details: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      city: ['', [Validators.required]]
    })
  });

  ngOnInit(): void {
    this.getCartId();
    this.getCartData();
  }

  getCartId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.cartId.set(id);
        }
      }
    });
  }

  getCartData(): void {
    this.cartService.getCartProducts().subscribe({
      next: (res) => {
        this.cartDetails.set(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  submitForm(): void {
    if (this.checkOut.valid) {
      this.isLoading.set(true);

      const shippingData = {
        shippingAddress: this.checkOut.value.shippingAddress
      };

      if (this.flag() === 'cash') {
        this.cartService.createCashOrder(this.cartId(), shippingData).subscribe({
          next: (res) => {
            this.isLoading.set(false);
            if (res.status === 'success') {
              this.cartService.updateCartCount(0, false);
              this.router.navigate(['/allorders']);
            }
          },
          error: (err) => {
            this.isLoading.set(false);
            console.error('Cash Order Error:', err);
          }
        });
      } else {
        this.cartService.checkoutSession(this.cartId(), shippingData).subscribe({
          next: (res) => {
            this.isLoading.set(false);
            if (res.status === 'success' && res.session?.url) {
              this.cartService.updateCartCount(0, false);
              window.open(res.session.url, '_self');
            }
          },
          error: (err) => {
            this.isLoading.set(false);
            console.error('Checkout Session Error:', err);
          }
        });
      }
    } else {
      this.checkOut.markAllAsTouched();
    }
  }

  changeFlag(el: HTMLInputElement): void {
    this.flag.set(el.value);
  }
}