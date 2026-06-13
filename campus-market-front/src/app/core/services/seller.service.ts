import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private http = inject(HttpClient);
  private readonly ordersUrl = 'http://localhost:3001/api/orders';
  private readonly productsUrl = 'http://localhost:3001/api/products';

  // Rota que refatoramos no NestJS protegida pelo RolesGuard
  confirmPayment(orderId: number, status: 'APROVADO' | 'RECUSADO') {
    return this.http.put(`${this.ordersUrl}/${orderId}/payment`, { status });
  }

  // Rota para mudar o status de preparo/retirada do salgado
  updateOrderStatus(orderId: number, status: 'PENDENTE' | 'PAGO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO') {
    return this.http.put(`${this.ordersUrl}/${orderId}/status`, { status });
  }

  // Envio de novo produto com suporte a Multipart/Form-Data para foto do lanche
  createProduct(productData: any) {
    return this.http.post(this.productsUrl, productData);
  }

  uploadProductImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(`${this.productsUrl}/upload`, formData);
  }
}