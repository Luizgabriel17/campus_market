import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm!: FormGroup;

  loading = false;

  errorMessage = '';

  successMessage = '';

  showPassword = false;

  showPasswordConfirm = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
    }, { validators: this.senhasMatch });
  }

  senhasMatch(group: FormGroup): any {
    const senha = group.get('senha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;

    if (senha !== confirmarSenha) {
      group.get('confirmarSenha')?.setErrors({ senhasMismatch: true });
      return { senhasMismatch: true };
    }
    return null;
  }

  get nomeControl() {
    return this.registerForm.get('nome');
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  get senhaControl() {
    return this.registerForm.get('senha');
  }

  get confirmarSenhaControl() {
    return this.registerForm.get('confirmarSenha');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmVisibility() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  register() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService
      .register({
        nome: this.registerForm.value.nome,
        email: this.registerForm.value.email,
        senha: this.registerForm.value.senha,
      })
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          this.successMessage = 'Conta criada com sucesso!';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },

        error: (error) => {
          console.error(error);
          this.errorMessage =
            error.error?.message ||
            'Erro ao criar conta. Tente novamente.';
        },

        complete: () => {
          this.loading = false;
        },
      });
  }
}
