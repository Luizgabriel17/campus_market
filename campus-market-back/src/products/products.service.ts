import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    // Validar se seller existe
    const sellerExists = await this.prisma.user.findUnique({
      where: { id: data.sellerId },
    });

    if (!sellerExists) {
      throw new NotFoundException('Seller not found');
    }

    // Validar se category existe
    const categoryExists = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!categoryExists) {
      throw new NotFoundException('Category not found');
    }

    // Validar preço positivo
    if (data.price <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }

    // Validar estoque não negativo
    if (data.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        price: data.price,
        stock: data.stock,
        sellerId: data.sellerId,
        categoryId: data.categoryId,
      },
      include: {
        seller: true,
        category: true,
      },
    });

    return product;
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: {
        seller: true,
        category: true,
      },
    });

    return products;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        seller: true,
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: number, data: UpdateProductDto) {
    // Validar se produto existe
    const productExists = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    // Validações opcionais se os campos forem fornecidos
    if (data.sellerId) {
      const sellerExists = await this.prisma.user.findUnique({
        where: { id: data.sellerId },
      });

      if (!sellerExists) {
        throw new NotFoundException('Seller not found');
      }
    }

    if (data.categoryId) {
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!categoryExists) {
        throw new NotFoundException('Category not found');
      }
    }

    if (data.price !== undefined && data.price <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data,
      include: {
        seller: true,
        category: true,
      },
    });

    return updatedProduct;
  }

  async remove(id: number) {
    // Validar se produto existe
    const productExists = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }
}