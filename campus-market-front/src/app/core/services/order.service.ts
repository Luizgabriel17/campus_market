import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/orders`;

  createOrder(
    paymentMethod: 'PIX' | 'CASH',
    deliveryAddressId: string,
    notes?: string,
    deliveryTime?: string,
  ) {
    return this.http.post(this.apiUrl, {
      method: paymentMethod,
      deliveryAddressId,
      notes: notes || undefined,
      deliveryTime: deliveryTime || undefined,
    });
  }

  getMyOrders() {
    return this.http.get<any[]>(`${this.apiUrl}/my-purchases`);
  }

  getSellerOrders() {
    return this.http.get<any[]>(`${this.apiUrl}/seller`);
  }

  confirmOrder(orderId: number) {
    return this.http.put<any>(`${this.apiUrl}/${orderId}/confirm`, {});
  }

  updateOrderStatus(orderId: number, status: string) {
    return this.http.put(`${this.apiUrl}/${orderId}/status`, { status });
  }

  updatePaymentStatus(orderId: number, status: string) {
    return this.http.put(`${this.apiUrl}/${orderId}/payment`, { status });
  }
}