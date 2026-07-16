import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterModule
} from '@angular/router';

import {
  UserService
} from '../../core/services/user.service';

import {
  AddressService
} from '../../core/services/Address.service';

import {
  AuthService
} from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {

  private userService = inject(UserService);
  private addressService = inject(AddressService);
  private authService = inject(AuthService);

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

  selectedFile: File | null = null;

  password = {
    currentPassword: '',
    newPassword: ''
  };

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService
      .getProfile()
      .subscribe((res: any) => {
        this.user = res;
        if (res.phone) {
          this.user.phone = this.formatInitialPhone(res.phone);
        }
        this.addresses = res.addresses || [];
        if (!this.newAddress.recipient) {
          this.newAddress.recipient = res.name || '';
        }
        if (!this.newAddress.phone) {
          this.newAddress.phone = res.phone ? this.formatInitialPhone(res.phone) : '';
        }
      });
  }

  onFileSelected(event: Event) {
    const input =
      event.target as HTMLInputElement;

    if (input.files?.length) {
      this.selectedFile =
        input.files[0];
    }
  }

  uploadAvatar() {
    if (!this.selectedFile) {
      alert('Selecione uma imagem.');
      return;
    }

    this.authService
      .updateAvatar(this.selectedFile)
      .subscribe({
        next: (user: any) => {
          this.user.avatar = user.avatar;

          const current =
            this.authService.getCurrentUser();

          localStorage.setItem(
            'campus_market_user',
            JSON.stringify({
              ...current,
              avatar: user.avatar
            })
          );

          alert('Foto atualizada com sucesso.');
        },
        error: () => {
          alert('Erro ao enviar imagem.');
        }
      });
  }

  save() {
    this.userService
      .updateProfile({
        name: this.user.name,
        phone: this.user.phone
      })
      .subscribe({
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
        error: () => {
          alert('Erro ao atualizar perfil.');
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
    this.userService
      .changePassword(this.password)
      .subscribe(() => {
        alert('Senha alterada.');

        this.password = {
          currentPassword: '',
          newPassword: ''
        };
      });
  }

  deleteAccount() {
    const ok = confirm(
      'Deseja realmente excluir sua conta?'
    );

    if (!ok) {
      return;
    }

    this.userService
      .deleteAccount()
      .subscribe(() => {
        this.authService.logout();
      });
  }

  addAddress() {
    this.addressService.createAddress(this.newAddress).subscribe({
      next: () => {
        alert('Endereço adicionado com sucesso!');
        this.loadProfile();
        this.resetAddressForm();
      },
      error: (err) => {
        alert(err?.error?.message || 'Erro ao adicionar endereço.');
      }
    });
  }

  deleteAddress(id: string) {
    if (!confirm('Deseja realmente remover este endereço?')) return;
    this.addressService.deleteAddress(id).subscribe({
      next: () => {
        alert('Endereço removido com sucesso.');
        this.loadProfile();
      },
      error: () => {
        alert('Erro ao remover endereço.');
      }
    });
  }

  onCepInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }
    this.newAddress.zipCode = value;
    input.value = value;

    const cleanCep = value.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      this.addressService.lookupCep(cleanCep).subscribe({
        next: (data) => {
          if (data && !data.erro) {
            this.newAddress.street = data.logradouro || '';
            this.newAddress.neighborhood = data.bairro || '';
            this.newAddress.city = data.localidade || '';
            this.newAddress.state = data.uf || '';
          }
        },
        error: (err) => {
          console.error('Erro ao buscar CEP:', err);
        }
      });
    }
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