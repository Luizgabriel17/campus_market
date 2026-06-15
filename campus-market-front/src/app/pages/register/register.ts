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
  role = ''; // <--- Nova propriedade que vai receber o valor do <select> no HTML
  errorMessage = '';

  onSubmit() {
    this.errorMessage = '';

    // Validação extra no frontend para garantir que uma opção foi selecionada
    if (!this.role) {
      this.errorMessage = 'Por favor, selecione se deseja comprar ou vender.';
      return;
    }

    const payload = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role // <--- Adicionado o papel selecionado no payload enviado ao backend
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        // Usuário cadastrado e logado automaticamente, vai para a vitrine
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao realizar o cadastro. Tente novamente.';
      }
    });
  }
}