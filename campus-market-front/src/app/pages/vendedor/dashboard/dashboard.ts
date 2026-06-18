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