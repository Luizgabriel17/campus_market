import { Component, inject, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

declare global {
  const google: any;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  email = '';
  password = '';
  errorMessage = '';

  ngOnInit() {
    // Inicializa o botão do Google assim que a página carrega
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: 'SEU_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Substitua pelo ID do seu Console Google
        callback: (response: any) => this.handleGoogleCredential(response.credential)
      });

      google.accounts.id.renderButton(
        document.getElementById('google-btn-container'),
        { theme: 'outline', size: 'large', width: '100%', text: 'signin_with' }
      );
    }
  }

  onSubmit() {
    this.errorMessage = '';
    
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.user.role === 'VENDEDOR') {
          this.router.navigate(['/vendedor/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Falha ao realizar login. Verifique os dados.';
      }
    });
  }

  private handleGoogleCredential(token: string) {
    // NgZone garante que o Angular perceba a mudança de rota vinda do callback externo do Google
    this.ngZone.run(() => {
      this.authService.loginWithGoogle(token).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.errorMessage = 'Erro na autenticação com o Google institucional.';
        }
      });
    });
  }
}