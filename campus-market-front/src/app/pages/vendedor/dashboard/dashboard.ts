import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  authService = inject(AuthService);
  private orderService = inject(OrderService);

  ordersReceived = signal<any[]>([]);
  errorMessage = '';

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

  formatPhone(phone: string): string {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  private refreshInterval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.loadIncomingOrders();

    this.refreshInterval = setInterval(() => {
      this.loadIncomingOrders();
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadIncomingOrders(): void {
    this.orderService.getSellerOrders().subscribe({
      next: (orders) => {
        this.ordersReceived.set(orders);
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos:', error);
        this.errorMessage = 'Erro ao carregar pedidos.';
      }
    });
  }

  approve(orderId: number): void {
    this.orderService
      .updatePaymentStatus(orderId, 'APROVADO')
      .subscribe({
        next: () => {
          this.loadIncomingOrders();
        },
        error: (error) => {
          console.error(error);
          alert('Erro ao confirmar pagamento.');
        }
      });
  }

  markAsDelivered(orderId: number): void {
    this.orderService
      .updateOrderStatus(orderId, 'ENTREGUE')
      .subscribe({
        next: () => {
          this.loadIncomingOrders();
        },
        error: (error) => {
          console.error(error);
          alert('Erro ao marcar pedido como entregue.');
        }
      });
  }

  cancelOrder(orderId: number): void {
    const confirmCancel = confirm('Deseja realmente cancelar este pedido?');
    if (!confirmCancel) return;

    this.orderService
      .updateOrderStatus(orderId, 'CANCELADO')
      .subscribe({
        next: () => {
          this.orderService.updatePaymentStatus(orderId, 'RECUSADO').subscribe({
            next: () => this.loadIncomingOrders(),
            error: () => this.loadIncomingOrders()
          });
        },
        error: (error) => {
          console.error(error);
          alert('Erro ao cancelar pedido.');
        }
      });
  }

  contactCustomer(order: any) {
    if (!order.customer?.phone) {
      alert('Telefone do cliente não cadastrado.');
      return;
    }
    let cleanPhone = order.customer.phone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('55') && cleanPhone.length <= 11) {
      cleanPhone = '55' + cleanPhone;
    }
    const itemsText = order.items.map((item: any) => `${item.quantity}x ${item.product?.name}`).join(', ');
    const text = encodeURIComponent(
      `Olá ${order.customer.name}! Sou o vendedor do CampusMarket e estou entrando em contato sobre o seu pedido #${order.id} (${itemsText}).`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  }

  getPendingCount(): number {
    return this.ordersReceived().filter(
      order => order.status === 'PENDENTE'
    ).length;
  }

  getApprovedCount(): number {
    return this.ordersReceived().filter(
      order =>
        order.status === 'PAGO' ||
        order.status === 'APROVADO'
    ).length;
  }

  getDeliveredCount(): number {
    return this.ordersReceived().filter(
      order => order.status === 'ENTREGUE'
    ).length;
  }

  getTotalRevenue(): number {
    return this.ordersReceived()
      .filter(order => order.status !== 'CANCELADO')
      .reduce(
        (total, order) => total + Number(order.total),
        0
      );
  }
}