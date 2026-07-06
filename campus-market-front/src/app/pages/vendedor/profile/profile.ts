import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { AddressService } from '../../../core/services/Address.service';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class SellerProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private addressService = inject(AddressService);

  user: any = {};
  addresses: any[] = [];

  showAddressForm = false;
  newAddress = {
    recipient: '',
    phone: '',
    street: 'Centro de Vivência',
    number: 'S/N',
    neighborhood: 'IF-PAR',
    city: 'Paranavaí',
    state: 'PR',
    zipCode: '87703-000',
    complement: '',
    reference: '',
    isDefault: true
  };

  selectedAvatar: File | null = null;
  avatarPreview: string | null = null;

  password = {
    currentPassword: '',
    newPassword: '',
  };

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (res: any) => {
        this.user = res;
        if (res.phone) {
          this.user.phone = this.formatInitialPhone(res.phone);
        }
        this.addresses = res.addresses || [];

        if (this.user.avatar) {
          this.avatarPreview = this.user.avatar;
        }
        if (!this.newAddress.recipient) {
          this.newAddress.recipient = res.name || '';
        }
        if (!this.newAddress.phone) {
          this.newAddress.phone = res.phone ? this.formatInitialPhone(res.phone) : '';
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.selectedAvatar = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
    };
    reader.readAsDataURL(this.selectedAvatar);
  }

  uploadAvatar() {
    if (!this.selectedAvatar) {
      alert('Selecione uma imagem.');
      return;
    }

    this.authService.updateAvatar(this.selectedAvatar).subscribe({
      next: (user: any) => {
        this.user.avatar = user.avatar;
        this.avatarPreview = user.avatar;

        const current = this.authService.getCurrentUser();
        localStorage.setItem(
          'campus_market_user',
          JSON.stringify({
            ...current,
            avatar: user.avatar
          })
        );
        alert('Logo atualizado com sucesso.');
        this.selectedAvatar = null;
      },
      error: () => {
        alert('Erro ao enviar imagem.');
      }
    });
  }

  save() {
    this.userService.updateProfile({
      name: this.user.name,
      phone: this.user.phone
    }).subscribe({
      next: () => {
        const current = this.authService.getCurrentUser();
        localStorage.setItem(
          'campus_market_user',
          JSON.stringify({
            ...current,
            name: this.user.name,
            phone: this.user.phone
          })
        );
        alert('Perfil atualizado com sucesso.');
      },
      error: (err) => {
        alert(err.error?.message || 'Erro ao atualizar perfil.');
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    const first = parts[0].charAt(0);
    const last = parts[parts.length - 1].charAt(0);
    return (first + last).toUpperCase();
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    this.user.phone = value;
    input.value = value;
  }

  formatInitialPhone(phone: string): string {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  changePassword() {
    if (!this.password.currentPassword || !this.password.newPassword) {
      alert('Preencha todos os campos.');
      return;
    }

    this.userService.changePassword(this.password).subscribe({
      next: () => {
        alert('Senha alterada com sucesso!');
        this.password = {
          currentPassword: '',
          newPassword: '',
        };
      },
      error: (err) => {
        alert(err.error?.message || 'Erro ao alterar senha.');
      },
    });
  }

  deleteAccount() {
    const confirmDelete = confirm('Tem certeza que deseja desativar sua conta?');
    if (!confirmDelete) {
      return;
    }

    this.userService.deleteAccount().subscribe({
      next: () => {
        alert('Conta desativada.');
        this.authService.logout();
      },
      error: () => {
        alert('Erro ao desativar conta.');
      },
    });
  }

  addAddress() {
    this.addressService.createAddress(this.newAddress).subscribe({
      next: () => {
        alert('Ponto de retirada adicionado com sucesso!');
        this.loadProfile();
        this.resetAddressForm();
      },
      error: (err) => {
        alert(err?.error?.message || 'Erro ao adicionar ponto.');
      }
    });
  }

  deleteAddress(id: string) {
    if (!confirm('Deseja realmente remover este ponto de retirada?')) return;
    this.addressService.deleteAddress(id).subscribe({
      next: () => {
        alert('Ponto removido com sucesso.');
        this.loadProfile();
      },
      error: () => {
        alert('Erro ao remover ponto.');
      }
    });
  }

  resetAddressForm() {
    this.showAddressForm = false;
    this.newAddress = {
      recipient: this.user.name || '',
      phone: this.user.phone || '',
      street: 'Centro de Vivência',
      number: 'S/N',
      neighborhood: 'IF-PAR',
      city: 'Paranavaí',
      state: 'PR',
      zipCode: '87703-000',
      complement: '',
      reference: '',
      isDefault: true
    };
  }
}