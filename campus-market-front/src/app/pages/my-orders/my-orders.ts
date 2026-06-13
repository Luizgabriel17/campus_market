import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-orders.html',
  styleUrls: ['./my-orders.css']
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<any[]>([]);
  errorMessage = '';

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: (data) => this.orders.set(data),
      error: () => this.errorMessage = 'Erro ao carregar o seu histórico de pedidos.'
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'PENDENTE': return 'status-pending';
      case 'PAGO': return 'status-paid';
      case 'ENTREGUE': return 'status-done';
      default: return 'status-canceled';
    }
  }
}