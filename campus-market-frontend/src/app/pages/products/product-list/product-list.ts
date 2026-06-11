import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MockDataService, Product } from '../../../core/services/mock-data';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory = '';
  searchTerm = '';
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private mockData: MockDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.products = this.mockData.getProducts();
    this.filteredProducts = this.products;
    this.categories = this.mockData.getCategories();
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchCategory = !this.selectedCategory || product.category === this.selectedCategory;
      const matchSearch =
        !this.searchTerm ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchCategory && matchSearch;
    });
  }

  onSearchChange() {
    this.filterProducts();
  }

  onCategoryChange() {
    this.filterProducts();
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  goToProductDetail(id: number) {
    this.router.navigate(['/products', id]);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}

