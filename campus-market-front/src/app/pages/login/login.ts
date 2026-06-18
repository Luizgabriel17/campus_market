import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  
  // Controle de visibilidade da senha (VER/OCULTAR)
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.errorMessage = '';
    
    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => this.redirectByUserRole(res.user.role),
      error: (err) => this.errorMessage = err.error?.message || 'Falha ao realizar login. Verifique suas credenciais.'
    });
  }

  private redirectByUserRole(role: string) {

  switch (role) {

    case 'VENDEDOR':
      this.router.navigate(['/vendedor/dashboard']);
      break;

    case 'ADMIN':
      this.router.navigate(['/vendedor/dashboard']);
      break;

    default:
      this.router.navigate(['/home']);
      break;
  }
}
}