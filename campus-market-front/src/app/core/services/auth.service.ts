import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => this.saveSession(res))
    );
  }

  // Cadastro — NÃO salva sessão ainda, aguarda verificação do OTP
  register(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, payload);
  }

  // Verifica o OTP — salva sessão apenas após confirmação
  verifyEmail(userId: number, code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify-email`, { userId, code }).pipe(
      tap((res) => this.saveSession(res))
    );
  }

  // Reenvio do código OTP
  resendCode(userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/resend-code`, { userId });
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
    localStorage.setItem('campus_market_token', res.access_token);
    localStorage.setItem('campus_market_user', JSON.stringify(res.user));
  }
  updateAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<any>(
      `${environment.apiUrl}/users/me/avatar`,
      formData,
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(payload: { userId: number; code: string; newPassword: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, payload);
  }
}