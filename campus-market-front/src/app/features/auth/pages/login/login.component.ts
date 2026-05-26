import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';

  senha = '';

  loading = false;

  errorMessage = '';

  constructor(
    private authService: AuthService,
  ) {}

  login() {
    this.loading = true;

    this.errorMessage = '';

    this.authService
      .login({
        email: this.email,
        senha: this.senha,
      })
      .subscribe({
        next: (response) => {
          console.log(response);

          this.authService.saveToken(
            response.token,
          );

          alert('Login realizado!');
        },

        error: (error) => {
          console.error(error);

          this.errorMessage =
            error.error.message ||
            'Erro ao fazer login';
        },

        complete: () => {
          this.loading = false;
        },
      });
  }

  loginGoogle() {
    window.location.href =
      'http://localhost:3000/auth/google';
  }
}