import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SellerService } from '../../../core/services/seller.service';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products-form.html',
  styleUrls: ['./products-form.css']
})
export class ProductsFormComponent {
  private sellerService = inject(SellerService);
  private router = inject(Router);

  // Campos do formulário
  name = '';
  description = '';
  price: number | null = null;
  stock: number | null = null;
  categoryId = 1; // Categoria padrão (ex: Salgados)

  selectedFile: File | null = null;
  errorMessage = '';
  isLoading = false;

  // Função disparada quando o usuário seleciona uma foto de lanche
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (!this.price || !this.stock) {
      this.errorMessage = 'Por favor, preencha o preço e o estoque.';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    // Fluxo estruturado: 
    // 1. Se houver imagem selecionada, faz o upload primeiro para pegar a URL gerada
    if (this.selectedFile) {
      this.sellerService.uploadProductImage(this.selectedFile).subscribe({
        next: (uploadRes) => {
          this.saveProduct(uploadRes.imageUrl);
        },
        error: () => {
          this.errorMessage = 'Erro ao fazer upload da imagem do lanche.';
          this.isLoading = false;
        }
      });
    } else {
      // Se não enviou foto, cria o produto com imagem vazia/padrão
      this.saveProduct('');
    }
  }

  private saveProduct(imageUrl: string) {
    const productPayload = {
      name: this.name,
      description: this.description,
      price: Number(this.price),
      stock: Number(this.stock),
      categoryId: Number(this.categoryId),
      imageUrl: imageUrl || null
    };

    this.sellerService.createProduct(productPayload).subscribe({
      next: () => {
        alert('Lanche cadastrado com sucesso e já está disponível no cardápio!');
        this.router.navigate(['/vendedor/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao cadastrar o produto no banco de dados.';
        this.isLoading = false;
      }
    });
  }
}