import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'CLIENTE' | 'VENDEDOR' | 'ADMIN';
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3001/api/auth';

  currentUser = signal<AuthResponse['user'] | null>(null);

  constructor() {
    const savedUser = localStorage.getItem('campus_market_user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: AuthResponse) => this.handleAuthentication(res))
    );
  }

  loginWithGoogle(googleToken: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google`, { token: googleToken }).pipe(
      tap((res: AuthResponse) => this.handleAuthentication(res))
    );
  }

  register(userData: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap((res: AuthResponse) => this.handleAuthentication(res))
    );
  }

  logout() {
    localStorage.removeItem('campus_market_token');
    localStorage.removeItem('campus_market_user');
    this.currentUser.set(null);
  }

  private handleAuthentication(res: AuthResponse) {
    localStorage.setItem('campus_market_token', res.access_token);
    localStorage.setItem('campus_market_user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('campus_market_token');
  }

  getUserRole(): string | null {
    return this.currentUser()?.role || null;
  }
}