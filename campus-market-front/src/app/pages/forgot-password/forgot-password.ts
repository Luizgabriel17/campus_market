import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);

  step = 1;
  email = '';
  code = '';
  newPassword = '';
  confirmPassword = '';
  userId: number | null = null;

  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  errorMessage = '';

  onRequestCode() {
    this.errorMessage = '';
    if (!this.email.trim()) {
      this.errorMessage = 'Por favor, informe seu e-mail.';
      return;
    }
    
    this.loading = true;
    this.authService.forgotPassword(this.email.trim()).subscribe({
      next: (res) => {
        this.userId = res.userId;
        this.step = 2;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao solicitar código. Verifique o e-mail digitado.';
        this.loading = false;
      }
    });
  }

  onResetPassword() {
    this.errorMessage = '';
    if (!this.code || this.code.length !== 6) {
      this.errorMessage = 'Digite o código de verificação de 6 dígitos.';
      return;
    }

    if (!this.newPassword || this.newPassword.length < 6) {
      this.errorMessage = 'A nova senha deve ter no mínimo 6 caracteres.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'As senhas não correspondem.';
      return;
    }

    if (!this.userId) {
      this.errorMessage = 'Erro no processo. Tente novamente do início.';
      return;
    }

    this.loading = true;
    this.authService.resetPassword({
      userId: this.userId,
      code: this.code.trim(),
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.step = 3;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Código incorreto ou expirado.';
        this.loading = false;
      }
    });
  }
}
