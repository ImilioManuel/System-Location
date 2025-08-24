import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  mobileMenuOpen = false;
  isLoggedIn = false;

  constructor(private auth: AuthService, private router: Router) {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.auth.isAuthenticated$.subscribe(v => this.isLoggedIn = v);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

}
