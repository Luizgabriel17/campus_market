import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://opulent-robot-pjr7rx457r4p39wg4-4200.app.github.dev/api/products';

  getProducts() {
    return this.http.get<Product[]>(this.apiUrl);
  }
}