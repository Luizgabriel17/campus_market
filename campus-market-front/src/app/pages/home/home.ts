import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  authService = inject(AuthService);

  products = signal<any[]>([]);
  errorMessage = '';

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar o cardápio de lanches.';
      }
    });
  }

  addToCart(product: any) {

  this.cartService.addToCart(product.id, 1).subscribe({
    next: () => {
      alert(`${product.name} adicionado ao carrinho!`);
    },
    error: (err) => {
      console.error('Erro ao adicionar ao carrinho', err);

      this.errorMessage =
        err?.error?.message ||
        'Não foi possível adicionar ao carrinho.';
    }
  });

}
}