import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  authService = inject(AuthService);

  products = signal<any[]>([]);
  cartItemCount = signal<number>(0);
  errorMessage = '';

  categories = signal<string[]>([]);
  selectedCategory = signal<string>('Todos');
  searchTerm = signal<string>('');
  sortBy = signal<string>('nome');

  filteredProducts = computed(() => {
    let list = this.products();
    
    // Category filter
    const cat = this.selectedCategory();
    if (cat !== 'Todos') {
      list = list.filter(p => p.category?.name === cat);
    }
    
    // Search filter
    const search = this.searchTerm().trim().toLowerCase();
    if (search) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(search) || 
        (p.description && p.description.toLowerCase().includes(search))
      );
    }
    
    // Sort
    const sort = this.sortBy();
    const sorted = [...list];
    if (sort === 'preco-crescente') {
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === 'preco-decrescente') {
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === 'nome') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return sorted;
  });

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

  formatDisplayName(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1]}`;
  }

  ngOnInit() {
    this.loadProducts();
    this.loadCartCount();
  }

  private loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        const uniqueCategories = Array.from(
          new Set(data.map((p: any) => p.category?.name).filter(Boolean))
        ) as string[];
        this.categories.set(['Todos', ...uniqueCategories]);
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar o cardápio de lanches.';
      }
    });
  }

  private loadCartCount() {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        const count = cart?.items?.reduce(
          (acc: number, item: any) => acc + item.quantity, 0
        ) ?? 0;
        this.cartItemCount.set(count);
      },
      error: () => this.cartItemCount.set(0)
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        this.cartItemCount.update(count => count + 1);
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message || 'Não foi possível adicionar ao carrinho.';
      }
    });
  }
}