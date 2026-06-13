import { Component, inject, OnInit, signal, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';

// Pipe criado inline e declarado como standalone para somar a bandeja de lanches
@Pipe({
  name: 'totalCart',
  standalone: true
})
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
  private router = inject(Router);

  cartData = signal<any>(null);
  paymentMethod: 'PIX' | 'CASH' = 'PIX';
  errorMessage = '';

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (data) => this.cartData.set(data),
      error: () => this.errorMessage = 'Erro ao carregar os itens do seu carrinho.'
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
    this.orderService.createOrder(this.paymentMethod).subscribe({
      next: () => {
        alert('Pedido realizado com sucesso! Vá retirar no intervalo.');
        this.router.navigate(['/my-orders']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Falha ao finalizar o pedido.';
      }
    });
  }
}