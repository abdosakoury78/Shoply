import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../Services/cart.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cart } from '../../Interfaces/cart.interface';
import { OrderService } from '../../Services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {

  formData!: FormGroup;

  cartItems = signal<Cart | null>(null);

  cartId!: string;

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {

    this.formData = new FormGroup({

      details: new FormControl('', [
        Validators.required
      ]),

      city: new FormControl('', [
        Validators.required
      ]),

      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/)
      ])

    });

    this.cartService.getCartProducts().subscribe({
      next: ({ data }) => {
        this.cartItems.set(data);
      }
    });

    this.route.paramMap.subscribe(params => {
      this.cartId = params.get('id') as string;
    });
  }


  checkout() {

    // Check validation first
    if (this.formData.invalid) {

      this.formData.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please fill in all shipping information correctly.',
        confirmButtonColor: '#657f07'
      });

      return;
    }


    this.orderService
      .checkoutSession(this.cartId, this.formData.value)
      .subscribe({

        next: (res) => {

          window.location.href = res.session.url;

        },

        error: (err) => {

          console.log(err);

          Swal.fire({
            icon: 'error',
            title: 'Checkout Failed',
            text: 'Something went wrong while creating your checkout session. Please try again.',
            confirmButtonColor: '#657f07'
          });

        }

      });
  }
}