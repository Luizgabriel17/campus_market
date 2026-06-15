import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://opulent-robot-pjr7rx457r4p39wg4-4200.app.github.dev/api/orders';

  createOrder(paymentMethod: 'PIX' | 'CASH') {
    return this.http.post(this.apiUrl, { method: paymentMethod });
  }

  getMyOrders() {
    return this.http.get<any[]>(`${this.apiUrl}/my-purchases`);
  }
}