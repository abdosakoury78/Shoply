import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CartService } from '../../Services/cart.service';
import { CommonModule } from '@angular/common';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { WishlistService } from '../../Services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslocoModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly wishListService = inject(WishlistService);
  private readonly translocoService = inject(TranslocoService);

  cartCount = signal(0);
  wishListCount = signal(0);

  // جلب اللغة الحالية لقراءة قيمتها داخل الـ HTML (@if)
  get currentLang(): string {
    return this.translocoService.getActiveLang();
  }

  ngOnInit() {
    this.cartService.loadCartCount();
    this.getCartCount();
    this.wishListService.loadWishListCount();
    this.getWishListCount();
  }

  // التبديل بين اللغات وتغيير اتجاه الصفحة
  changeLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  getCartCount() {
    this.cartService.getCartCount().subscribe((count) => {
      this.cartCount.set(count);
    });
  }

  getWishListCount() {
    this.wishListService.getWishListCount().subscribe((count) => {
      this.wishListCount.set(count);
    })
  }

  logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/signin']);
  }
}