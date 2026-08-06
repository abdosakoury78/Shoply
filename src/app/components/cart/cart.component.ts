import { Component, inject, OnInit, signal } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { Cart } from '../../Interfaces/cart.interface';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {

  private readonly _CartService = inject(CartService);

  cartItems = signal<Cart | null>(null);

    ngOnInit(): void {
      this._CartService.getCartProducts().subscribe({
        next: ({data}) => {
          this.cartItems.set(data)
        },
        error: (err) => {
          console.log(err);
          
        }
      })

    }

    updateQuantity(productId:string , count:number){
      this._CartService.updateQuantity(productId,count).subscribe({
        next: ({data}) => {
          this.cartItems.set(data)
          console.log(data);
          
        },
        error:(err) => {
          console.log(err);
          
        }
      })
    }

    removeCartItem(productId:string){
      this._CartService.removeCartItem(productId).subscribe({
        next: ({data}) => {
          this.cartItems.set(data)
        },
        error:(err) => {
          console.log(err);
          
        }
      })
    }

    clearCart(): void {
      this._CartService.clearCart().subscribe({
        next: () => {
          this.cartItems.set(null);

        },
        error: (err) => {
          console.log(err);
        }
      });
    }
}
