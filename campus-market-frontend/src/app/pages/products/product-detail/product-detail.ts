import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDataService, Product } from '../../../core/services/mock-data';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  quantity = 1;
  addedToCart = false;

  constructor(
    private route: ActivatedRoute,
    private mockData: MockDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.product = this.mockData.getProductById(id) ?? null;
    });
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    this.addedToCart = true;
    setTimeout(() => {
      this.addedToCart = false;
    }, 2000);
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}

