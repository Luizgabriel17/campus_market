import { Component, inject, OnInit, OnDestroy, NgZone } from '@angular/core'; // 👈 Adicionado o OnDestroy aqui
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
export class LoginComponent implements OnInit, OnDestroy { // 👈 Adicionado o "implements OnDestroy"
  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  email = '';
  password = '';
  errorMessage = '';

  showOnboardingModal = false;
  userIdFromGoogle: number | null = null;
  isLoadingModal = false;

  ngOnInit() {
    const initializeGoogle = () => {
      if (typeof google !== 'undefined') {
        if (!(window as any).google_initialized) {
          google.accounts.id.initialize({
            client_id: '101670248735-penhkhl4tt0u4ehcbtvj48tqqb3l2h8v.apps.googleusercontent.com',
            use_fedcm: false,
            callback: (response: any) => this.handleGoogleCredential(response.credential)
          });
          (window as any).google_initialized = true;
        }

        const btnContainer = document.getElementById('google-btn-container');
        if (btnContainer) {
          google.accounts.id.renderButton(
            btnContainer,
            { theme: 'outline', size: 'large', width: 250, text: 'signin_with' }
          );
        }
      }
    };

    if (typeof google !== 'undefined') {
      initializeGoogle();
    } else {
      window.addEventListener('load', () => {
        this.ngZone.run(() => initializeGoogle());
      });
    }
  }

  // 🔥 ESSE MÉTODO É A CHAVE DA SOLUÇÃO:
  ngOnDestroy() {
    if (typeof google !== 'undefined' && google.accounts?.id) {
      // Força o Google a cancelar os observadores e esquecer o botão antes do Angular destruir a tela
      google.accounts.id.cancel();
    }
  }

  onSubmit() {
    this.errorMessage = '';
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => this.redirectByUserRole(res.user.role),
      error: (err) => this.errorMessage = err.error?.message || 'Falha ao realizar login.'
    });
  }

  private handleGoogleCredential(token: string) {
    this.ngZone.run(() => {
      this.authService.loginWithGoogle(token).subscribe({
        next: (res: any) => {
          if (res.isNewUser) {
            this.userIdFromGoogle = res.user.id;
            this.showOnboardingModal = true;
          } else {
            const savedUser = JSON.parse(localStorage.getItem('campus_market_user') || '{}');
            this.redirectByUserRole(savedUser.role || res.user?.role);
          }
        },
        error: () => this.errorMessage = 'Erro na autenticação com o Google.'
      });
    });
  }

  selectGoogleRole(chosenRole: 'CLIENTE' | 'VENDEDOR') {
    if (!this.userIdFromGoogle) return;
    this.isLoadingModal = true;
    this.authService.updateUserRole(this.userIdFromGoogle, chosenRole).subscribe({
      next: () => {
        this.isLoadingModal = false;
        this.showOnboardingModal = false;
        this.redirectByUserRole(chosenRole);
      },
      error: () => {
        this.isLoadingModal = false;
        alert('Erro ao salvar sua escolha.');
      }
    });
  }

  private redirectByUserRole(role: string) {
    if (role === 'VENDEDOR') {
      this.router.navigate(['/vendedor/dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}