import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../../core/services/auth';

import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;

  loading = false;

  googleLoading = false;

  errorMessage = '';

  successMessage = '';

  showPassword = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get senhaControl() {
    return this.loginForm.get('senha');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService
      .login({
        email: this.loginForm.value.email,
        senha: this.loginForm.value.senha,
      })
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          this.successMessage = 'Login realizado com sucesso!';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },

        error: (error) => {
          console.error(error);
          this.errorMessage =
            error.error?.message ||
            'Email ou senha incorretos. Tente novamente.';
        },

        complete: () => {
          this.loading = false;
        },
      });
  }

  loginGoogle() {
    this.googleLoading = true;
    window.location.href =
      'http://localhost:3000/auth/google';
  }
}