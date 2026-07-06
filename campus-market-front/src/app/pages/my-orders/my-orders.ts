import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-orders.html',
  styleUrls: ['./my-orders.css']
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  authService = inject(AuthService);

  orders = signal<any[]>([]);
  errorMessage = '';

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: (data) => this.orders.set(data),
      error: () => this.errorMessage = 'Erro ao carregar o seu histórico de pedidos.'
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDENTE':
        return 'status-pending';
      case 'PAGO':
        return 'status-paid';
      case 'ENVIADO':
        return 'status-preparing';
      case 'ENTREGUE':
        return 'status-done';
      default:
        return 'status-canceled';
    }
  }

  contactSeller(order: any) {
    if (!order.seller?.phone) {
      alert('Telefone do vendedor não cadastrado.');
      return;
    }
    let cleanPhone = order.seller.phone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('55') && cleanPhone.length <= 11) {
      cleanPhone = '55' + cleanPhone;
    }
    const itemsText = order.items.map((item: any) => `${item.quantity}x ${item.product?.name}`).join(', ');
    const text = encodeURIComponent(
      `Olá ${order.seller.name}! Estou entrando em contato sobre o meu pedido #${order.id} (${itemsText}) no valor de R$ ${order.total}.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  }
}