import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

interface AuthResponse {
  access_token: string;
  isNewUser?: boolean; // <--- Adicionado para suportar o onboarding do Google
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
  // URL base adaptada
  private readonly authUrl = 'https://opulent-robot-pjr7rx457r4p39wg4-3001.app.github.dev/api/auth';
  private readonly usersUrl = 'https://opulent-robot-pjr7rx457r4p39wg4-3001.app.github.dev/api/users';

  currentUser = signal<AuthResponse['user'] | null>(null);

  constructor() {
    const savedUser = localStorage.getItem('campus_market_user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, credentials).pipe(
      tap((res: AuthResponse) => this.handleAuthentication(res))
    );
  }

  loginWithGoogle(googleToken: string) {
    // Retornamos a resposta completa para o componente conseguir ler o 'isNewUser'
    return this.http.post<AuthResponse>(`${this.authUrl}/google`, { token: googleToken }).pipe(
      tap((res: AuthResponse) => this.handleAuthentication(res))
    );
  }

  register(userData: any) {
    return this.http.post<AuthResponse>(`${this.authUrl}/register`, userData).pipe(
      tap((res: AuthResponse) => this.handleAuthentication(res))
    );
  }

  // Método para atualizar o Role do usuário utilizando o token guardado no LocalStorage
  updateUserRole(userId: number, role: 'CLIENTE' | 'VENDEDOR') {
    const token = localStorage.getItem('campus_market_token');
    return this.http.patch(`${this.usersUrl}/${userId}`, { role }, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(() => {
        // Atualiza o sinal do usuário com o novo papel escolhido
        const current = this.currentUser();
        if (current) {
          const updatedUser = { ...current, role };
          localStorage.setItem('campus_market_user', JSON.stringify(updatedUser));
          this.currentUser.set(updatedUser);
        }
      })
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