import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl =
    `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(data: {
    email: string;
    senha: string;
  }): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login`,
      data,
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/register`,
      data,
    );
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}