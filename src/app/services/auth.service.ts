import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface AuthUser {
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }

  login(email: string, password: string, rememberMe: boolean): Observable<{ success: boolean; error?: string }> {
    // Demo credentials. Replace with real API in production.
    const DEMO_EMAIL = 'admin@example.com';
    const DEMO_PASSWORD = 'Admin123!';

    const isValid = email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
    if (!isValid) {
      return of({ success: false, error: 'Credenciais inválidas. Verifique e tente novamente.' });
    }

    const token = 'demo-token-' + Date.now();
    if (rememberMe) {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify({ email }));
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
      sessionStorage.setItem(this.USER_KEY, JSON.stringify({ email }));
    }

    this.isAuthenticatedSubject.next(true);
    return of({ success: true });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.isAuthenticatedSubject.next(false);
  }
}


