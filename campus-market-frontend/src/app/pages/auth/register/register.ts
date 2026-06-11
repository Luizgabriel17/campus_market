import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  form = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  error = '';
  success = false;

  constructor(
    private router: Router,
    private auth: Auth
 ) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
   this.loading = true;
this.error = '';

this.auth.register({
  name: this.form.name,
  email: this.form.email,
  password: this.form.password,
})
.subscribe({
  next: () => {

    this.loading = false;
    this.success = true;

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);

  },

  error: (err) => {

    this.loading = false;

    this.error =
      err?.error?.message ||
      'Erro ao criar conta';

  }
});
  }
} 
