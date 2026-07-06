import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterModule,
  ActivatedRoute,
} from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import {
  Category,
  CategoryService,
} from '../../../core/services/category.service';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './products-form.html',
  styleUrls: ['./products-form.css'],
})
export class ProductsFormComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  name = '';
  description = '';
  price: number | null = null;
  stock: number | null = null;
  categoryId: number | null = null;

  categories: Category[] = [];

  selectedFile: File | null = null;

  editing = false;
  productId: number | null = null;
  imageUrl = '';

  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.loadCategories();

    const id =
      this.route.snapshot.queryParamMap.get(
        'id',
      );

    if (id) {
      this.editing = true;
      this.productId = Number(id);
      this.loadProduct();
    }
  }

  loadCategories() {
    this.categoryService
      .getCategories()
      .subscribe({
        next: (categories) => {
          this.categories = categories;

          if (
            categories.length > 0 &&
            !this.categoryId
          ) {
            this.categoryId =
              categories[0].id;
          }
        },
        error: () => {
          this.errorMessage =
            'Não foi possível carregar as categorias.';
        },
      });
  }

  loadProduct() {
    if (!this.productId) {
      return;
    }

    this.productService
      .getProduct(this.productId)
      .subscribe({
        next: (product) => {
          this.name = product.name;
          this.description =
            product.description || '';
          this.price = Number(
            product.price,
          );
          this.stock = product.stock;
          this.categoryId =
            product.categoryId;
          this.imageUrl =
            product.imageUrl || '';
        },
        error: () => {
          this.errorMessage =
            'Não foi possível carregar o produto.';
        },
      });
  }

  onFileSelected(event: Event) {
    const input =
      event.target as HTMLInputElement;

    if (input.files?.length) {
      this.selectedFile =
        input.files[0];
    }
  }

  saveProduct(imageUrl?: string) {
    const payload = {
      name: this.name.trim(),
      description: this.description.trim(),
      price: this.price,
      stock: this.stock,
      categoryId: this.categoryId,
      imageUrl: imageUrl || this.imageUrl || undefined
    };

    if (this.editing && this.productId) {
      this.productService.updateProduct(this.productId, payload).subscribe({
        next: () => {
          this.router.navigate(['/vendedor/products']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.message || 'Erro ao atualizar produto.';
        }
      });
    } else {
      this.productService.createProduct(payload).subscribe({
        next: () => {
          this.router.navigate(['/vendedor/products']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.message || 'Erro ao cadastrar produto.';
        }
      });
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

    if (this.selectedFile) {
      this.productService.uploadImage(this.selectedFile).subscribe({
        next: (res) => {
          this.saveProduct(res.url);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.message || 'Erro ao enviar imagem do produto.';
        }
      });
    } else {
      this.saveProduct();
    }
  }
}