import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  seller: string;
  rating: number;
}

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Notebook Samsung',
      description: 'Notebook Samsung 15 polegadas, processador Intel i7, 16GB RAM, 512GB SSD',
      price: 3500.00,
      stock: 12,
      image: 'https://via.placeholder.com/400x300?text=Notebook+Samsung',
      category: 'Eletrônicos',
      seller: 'TechStore',
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Fone Bluetooth Sony',
      description: 'Fone de ouvido Bluetooth com cancelamento de ruído ativo',
      price: 450.00,
      stock: 25,
      image: 'https://via.placeholder.com/400x300?text=Fone+Sony',
      category: 'Acessórios',
      seller: 'AudioMax',
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Monitor LG 24"',
      description: 'Monitor Full HD 24 polegadas, 75Hz, painel IPS',
      price: 850.00,
      stock: 8,
      image: 'https://via.placeholder.com/400x300?text=Monitor+LG',
      category: 'Eletrônicos',
      seller: 'DisplayTech',
      rating: 4.3,
    },
    {
      id: 4,
      name: 'Teclado Mecânico RGB',
      description: 'Teclado mecânico com switches RGB personalizáveis',
      price: 350.00,
      stock: 30,
      image: 'https://via.placeholder.com/400x300?text=Teclado+RGB',
      category: 'Periféricos',
      seller: 'GamerGear',
      rating: 4.6,
    },
    {
      id: 5,
      name: 'Mouse Logitech',
      description: 'Mouse sem fio com precisão óptica avançada',
      price: 150.00,
      stock: 40,
      image: 'https://via.placeholder.com/400x300?text=Mouse+Logitech',
      category: 'Periféricos',
      seller: 'PeripheralStore',
      rating: 4.4,
    },
    {
      id: 6,
      name: 'Webcam Logitech 1080p',
      description: 'Webcam Full HD com microfone embutido para videoconferência',
      price: 280.00,
      stock: 15,
      image: 'https://via.placeholder.com/400x300?text=Webcam+Logitech',
      category: 'Acessórios',
      seller: 'AudioMax',
      rating: 4.5,
    },
  ];

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getCategories(): string[] {
    return ['Eletrônicos', 'Acessórios', 'Periféricos', 'Computadores'];
  }
}
