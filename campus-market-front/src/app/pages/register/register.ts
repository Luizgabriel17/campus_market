import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  role = '';
  phone = '';
  errorMessage = '';

  showPassword = false;
  showConfirmPassword = false;

  showVerification = false;
  verificationCode = '';
  userId: number | null = null;
  registeredRole = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    this.errorMessage = '';

    if (!this.name.trim() || !this.email.trim() || !this.password || !this.confirmPassword || !this.role || !this.phone.trim()) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'A senha deve ter no mínimo 6 caracteres.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não correspondem.';
      return;
    }

    const payload = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password,
      role: this.role,
      phone: this.phone.trim(),
    };

    this.authService.register(payload).subscribe({
      next: (res: any) => {
        this.userId = res.userId;
        this.registeredRole = this.role;
        this.showVerification = true;
        if (res.message?.includes('cadastro pendente')) {
          this.errorMessage = '';
        }
      },
      error: (err) => {
        const apiMessage = err.error?.message;
        this.errorMessage = Array.isArray(apiMessage)
          ? apiMessage.join(', ')
          : apiMessage || 'Erro ao realizar o cadastro. Tente novamente.';
      }
    });
  }

  onVerify() {
    this.errorMessage = '';

    if (!this.verificationCode || this.verificationCode.length !== 6) {
      this.errorMessage = 'Digite o código de 6 dígitos enviado para o seu e-mail.';
      return;
    }

    this.authService.verifyEmail(this.userId!, this.verificationCode).subscribe({
      next: () => {
        if (this.registeredRole === 'VENDEDOR') {
          this.router.navigate(['/vendedor/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Código inválido ou expirado.';
      }
    });
  }

  onResendCode() {
    if (!this.userId) return;

    this.authService.resendCode(this.userId).subscribe({
      next: () => {
        this.errorMessage = '';
        alert('Novo código enviado para o seu e-mail!');
      },
      error: () => {
        this.errorMessage = 'Não foi possível reenviar o código.';
      }
    });
  }
}