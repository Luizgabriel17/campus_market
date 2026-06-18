import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

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
  private readonly apiUrl = 'http://localhost:3001/api/products';

  getProducts() {
    return this.http.get<Product[]>(this.apiUrl);
  }
  createProduct(productData: FormData): Observable<any> {
    // Usamos FormData porque o formulário envia um arquivo de imagem junto com os textos
    return this.http.post(this.apiUrl, productData);
  }
}