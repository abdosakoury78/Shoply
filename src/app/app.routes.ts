import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { BrandsComponent } from './components/brands/brands.component';
import { ProductsComponent } from './components/products/products.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { authGuardGuard } from './guards/auth-guard-guard';
import { isLoggedGuard } from './guards/is-logged-guard';
import { ProductComponent } from './components/product/product.component';
import { CheckoutComponent } from './components/check-out/check-out.component';
import { AllordersComponent } from './components/all-orders/all-orders.component';

export const routes: Routes = [
    {
        path: "", component: AuthLayoutComponent, canActivate:[isLoggedGuard],children: [
            { path: "", redirectTo:"signin" , pathMatch:"full" },
            { path: "signin", component: SigninComponent, title: "Sign In" },
            { path: "signup", component: SignupComponent, title: "Sign Up" },
        ]
    },
    {
        path: "", component: MainLayoutComponent,canActivate:[authGuardGuard] ,children: [
            { path: "", redirectTo:"home" , pathMatch:"full" },
            { path: "home", component: HomeComponent, title: 'Home' },
            { path: "categories", component: CategoriesComponent, title: "Categories" },
            { path: "brands", component: BrandsComponent, title: "Brands" },
            { path: "products", component: ProductsComponent, title: "Products" },
            {path: "products/:id", component: ProductComponent, title: "Products" },
            { path: "cart", component: CartComponent, title: "Cart" },
            { path: "wishlist", component:WishlistComponent, title: "WishList" },
            { path: "allorders", component: AllordersComponent, title: "All Orders" },
            {path: "checkout/:id", component: CheckoutComponent, title: "Checkout" },
        ]
    },
    // { path: "**", component: NotFoundComponent, title: "Not Found" }
];
