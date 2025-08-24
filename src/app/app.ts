import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from './components/header/header';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header],
  templateUrl: './app.html',
})
export class AppComponent {
  showHeader = true;

  constructor(private router: Router) {
    // Avalia inicialmente
    this.showHeader = this.shouldShowHeader(this.router.url);
    // Reage a mudanças de rota
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.showHeader = this.shouldShowHeader(e.urlAfterRedirects || e.url);
    });
  }

  private shouldShowHeader(url: string): boolean {
    try {
      const path = (url || '/').split('?')[0];
      return !path.startsWith('/login');
    } catch {
      return true;
    }
  }
}
