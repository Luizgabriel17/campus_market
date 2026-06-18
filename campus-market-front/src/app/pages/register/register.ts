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
  role = ''; 
  errorMessage = '';

  onSubmit() {
    this.errorMessage = '';

    if (!this.name.trim() || !this.email.trim() || !this.password || !this.role) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    const payload = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password,
      role: this.role 
    };

    this.authService.register(payload).subscribe({
      next: () => {
        window.location.href = '/home';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao realizar o cadastro. Tente novamente.';
      }
    });
  }
}