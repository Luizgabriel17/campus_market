import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private auth: Auth
    ){}

    goToRegister() {
    this.router.navigate(['/register']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

 onSubmit() {
  if (!this.email || !this.password) {
    this.error =
      'Por favor, preencha todos os campos';
    return;
  }

  this.loading = true;
  this.error = '';

  this.auth.login({
    email: this.email,
    password: this.password
  })
  .subscribe({
    next: (response) => {

  console.log('LOGIN OK');
  console.log(response);

  localStorage.setItem(
    'token',
    response.access_token
  );

  localStorage.setItem(
    'user',
    JSON.stringify(response.user)
  );

  this.loading = false;

  window.location.href = '/home';

},
    error: (err) => {

      this.loading = false;

      this.error =
        err?.error?.message ||
        'Email ou senha inválidos';

    }
  });
}
}

