import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-auth-navbar',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './auth-navbar.component.html',
  styleUrl: './auth-navbar.component.css',
})
export class AuthNavbarComponent {
  private readonly translocoService = inject(TranslocoService);

  get currentLang(): string {
    return this.translocoService.getActiveLang();
  }

  changeLanguage(lang: string): void {
    this.translocoService.setActiveLang(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }
}