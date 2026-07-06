import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterModule
} from '@angular/router';

import {
  ProductService,
  Product
} from '../../../core/services/product.service';

@Component({
  selector: 'app-seller-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class SellerProductsComponent
  implements OnInit {

  private productService =
    inject(ProductService);

  products: Product[] = [];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService
      .getMyProducts()
      .subscribe(products => {
        this.products =
          products;
      });
  }

  deleteProduct(id: number) {
    const ok = confirm(
      'Excluir produto?'
    );

    if (!ok) {
      return;
    }

    this.productService
      .deleteProduct(id)
      .subscribe(() => {
        this.loadProducts();
      });
  }
}