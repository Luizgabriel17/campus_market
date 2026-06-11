import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductListComponent implements OnInit {

  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.findAll().subscribe((data: any) => {
      this.products = data;
    });
  }
}