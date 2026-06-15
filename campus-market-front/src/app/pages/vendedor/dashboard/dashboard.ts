import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SellerService } from '../../../core/services/seller.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private sellerService = inject(SellerService);

  ordersReceived = signal<any[]>([]);
  errorMessage = '';

  ngOnInit() {
    this.loadIncomingOrders();
  }

  loadIncomingOrders() {
    // Busca todas as ordens do sistema. O NestJS vai filtrar automaticamente apenas as vendas DESTE vendedor
    this.http.get<any[]>('https://opulent-robot-pjr7rx457r4p39wg4-4200.app.github.dev/api/payments').subscribe({
      next: (payments) => {
        this.ordersReceived.set(payments);
      },
      error: () => this.errorMessage = 'Erro ao carregar o painel de vendas.'
    });
  }

  approve(paymentId: number, orderId: number) {
    this.sellerService.confirmPayment(orderId, 'APROVADO').subscribe({
      next: () => {
        alert('Pagamento confirmado! Estoque e status atualizados.');
        this.loadIncomingOrders();
      },
      error: (err) => alert(err.error?.message || 'Erro ao aprovar.')
    });
  }

  markAsDelivered(orderId: number) {
    this.sellerService.updateOrderStatus(orderId, 'ENTREGUE').subscribe({
      next: () => {
        alert('Lanche entregue ao aluno!');
        this.loadIncomingOrders();
      },
      error: () => alert('Erro ao atualizar status do pedido.')
    });
  }
}