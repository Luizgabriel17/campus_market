import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import {
  Category,
  CategoryService
} from '../../../core/services/category.service';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products-form.html',
  styleUrls: ['./products-form.css']
})
export class ProductsFormComponent implements OnInit {

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  name = '';
  description = '';
  price: number | null = null;
  stock: number | null = null;

  categoryId: number | null = null;

  categories: Category[] = [];

  selectedFile: File | null = null;

  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;

        if (categories.length > 0) {
          this.categoryId = categories[0].id;
        }
      },
      error: () => {
        this.errorMessage =
          'Não foi possível carregar as categorias.';
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {

    if (
      !this.name.trim() ||
      this.price === null ||
      this.price <= 0 ||
      this.stock === null ||
      this.stock < 0 ||
      !this.categoryId
    ) {
      this.errorMessage =
        'Preencha todos os campos obrigatórios.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();

    formData.append('name', this.name.trim());
    formData.append('description', this.description.trim());
    formData.append('price', this.price.toString());
    formData.append('stock', this.stock.toString());
    formData.append('categoryId', this.categoryId.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.createProduct(formData).subscribe({
      next: () => {
        this.router.navigate(['/vendedor/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;

        this.errorMessage =
          err?.error?.message ||
          'Erro ao cadastrar produto.';
      }
    });
  }
}