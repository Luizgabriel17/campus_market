import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:3001/api/users';

  getProfile() {
    return this.http.get<any>(
      `${this.apiUrl}/me/profile`
    );
  }

  updateProfile(data: any) {
    return this.http.patch(
      `${this.apiUrl}/me`,
      data
    );
  }

  changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.http.patch(
      `${this.apiUrl}/me/password`,
      data
    );
  }

  deleteAccount() {
    return this.http.delete(
      `${this.apiUrl}/me`
    );
  }
}