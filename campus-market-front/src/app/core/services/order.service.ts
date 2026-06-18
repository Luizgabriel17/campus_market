import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:3001/api/orders';

  createOrder(paymentMethod: 'PIX' | 'CASH') {
    return this.http.post(
      this.apiUrl,
      { method: paymentMethod }
    );
  }

  getMyOrders() {
    return this.http.get<any[]>(
      `${this.apiUrl}/my-purchases`
    );
  }

  getSellerOrders() {
    return this.http.get<any[]>(
      `${this.apiUrl}/seller`
    );
  }

  updateOrderStatus(
    orderId: number,
    status: string
  ) {
    return this.http.put(
      `${this.apiUrl}/${orderId}/status`,
      { status }
    );
  }

  updatePaymentStatus(
    orderId: number,
    status: string
  ) {
    return this.http.put(
      `${this.apiUrl}/${orderId}/payment`,
      { status }
    );
  }
}