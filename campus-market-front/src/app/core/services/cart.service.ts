import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cart`;

  getCart() {
    return this.http.get<any>(this.apiUrl);
  }

  addToCart(productId: number, quantity: number) {
    return this.http.post(`${this.apiUrl}/items`, { productId, quantity });
  }

  removeItem(productId: number) {
    return this.http.delete(`${this.apiUrl}/items/${productId}`);
  }

  updateQuantity(productId: number, quantity: number) {
    return this.http.put(`${this.apiUrl}/items/${productId}`, { quantity });
  }
}