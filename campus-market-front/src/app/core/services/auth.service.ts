import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
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

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => this.saveSession(res))
    );
  }

  register(payload: any): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
    tap((res) => {
      if (res && res.access_token) {
        this.saveSession(res);
      }
    })
  );
}

  logout() {
    localStorage.removeItem('campus_market_token');
    localStorage.removeItem('campus_market_user');
    window.location.href = '/login';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('campus_market_token');
  }

  getCurrentUser() {
    const userJson = localStorage.getItem('campus_market_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  private saveSession(res: AuthResponse) {
  localStorage.setItem(
    'campus_market_token',
    res.access_token
  );

  localStorage.setItem(
    'campus_market_user',
    JSON.stringify(res.user)
  );
}
}