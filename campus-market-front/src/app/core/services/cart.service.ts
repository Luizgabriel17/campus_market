import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://opulent-robot-pjr7rx457r4p39wg4-4200.app.github.dev/api/cart';

  getCart() {
    return this.http.get<any>(this.apiUrl);
  }

  addToCart(productId: number, quantity: number) {
    return this.http.post(`${this.apiUrl}/items`, { productId, quantity });
  }

  removeItem(productId: number) {
    return this.http.delete(`${this.apiUrl}/items/${productId}`);
  }
}