import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CartService } from '../../Services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  cartCount = signal(0);

  ngOnInit() {
    this.cartService.loadCartCount();
    this.getCartCount();
  }

  getCartCount() {
    this.cartService.getCartCount().subscribe((count) => {
      this.cartCount.set(count);
    })
  }

  logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/signin']);
  }
}
