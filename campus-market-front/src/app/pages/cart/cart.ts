import { Component, inject, OnInit, signal, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AddressService, Address } from '../../core/services/Address.service';

@Pipe({ name: 'totalCart', standalone: true })
export class TotalCartPipe implements PipeTransform {
  transform(items: any[] | null): number {
    if (!items) return 0;
    return items.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
  }
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TotalCartPipe],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private addressService = inject(AddressService);
  private router = inject(Router);

  cartData = signal<any>(null);
  addresses = signal<Address[]>([]);

  paymentMethod: 'PIX' | 'CASH' = 'PIX';
  selectedAddressId = '';
  notes = '';
  deliveryDateTime = '';
  errorMessage = '';

  ngOnInit() {
    this.loadCart();
    this.loadAddresses();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (data) => this.cartData.set(data),
      error: () => this.errorMessage = 'Erro ao carregar os itens do seu carrinho.'
    });
  }

  loadAddresses() {
    this.addressService.getAddresses().subscribe({
      next: (data) => {
        this.addresses.set(data);
        // Seleciona o endereço padrão automaticamente
        const defaultAddress = data.find(a => a.isDefault) || data[0];
        if (defaultAddress) {
          this.selectedAddressId = defaultAddress.id;
        }
      },
      error: () => {}
    });
  }

  onRemoveItem(productId: number) {
    this.cartService.removeItem(productId).subscribe({
      next: () => this.loadCart(),
      error: () => alert('Não foi possível remover o item.')
    });
  }

  checkout() {
    this.errorMessage = '';

    if (!this.selectedAddressId) {
      this.errorMessage = 'Selecione um endereço de entrega antes de finalizar o pedido.';
      return;
    }

    let formattedDeliveryTime = '';
    if (this.deliveryDateTime) {
      const dt = new Date(this.deliveryDateTime);
      const day = String(dt.getDate()).padStart(2, '0');
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const year = dt.getFullYear();
      const hours = String(dt.getHours()).padStart(2, '0');
      const minutes = String(dt.getMinutes()).padStart(2, '0');
      formattedDeliveryTime = `${day}/${month}/${year} às ${hours}:${minutes}`;
    }

    this.orderService.createOrder(
      this.paymentMethod,
      this.selectedAddressId,
      this.notes,
      formattedDeliveryTime || undefined,
    ).subscribe({
      next: () => {
        this.router.navigate(['/my-orders']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Falha ao finalizar o pedido.';
      }
    });
  }
}