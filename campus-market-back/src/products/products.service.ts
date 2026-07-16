import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(
  sellerId: number,
  data: {
    categoryId: number;
    name: string;
    description?: string;
    imageUrl?: string;
    price: number;
    stock: number;
  },
) {
  const category = await this.prisma.category.findUnique({
    where: {
      id: data.categoryId,
    },
  });

  if (!category) {
    throw new BadRequestException(
      'Categoria não encontrada.',
    );
  }

  return this.prisma.product.create({
    data: {
      ...data,
      sellerId,
    },
  });
}

  async findAll() {
    return this.prisma.product.findMany({
      where: { status: 'ATIVO' },
      include: {
        seller: { select: { id: true, name: true, avatar: true } },
        category: true,
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { seller: { select: { name: true } }, category: true },
    });
    if (!product || product.status === 'INATIVO') {
      throw new NotFoundException('Lanche não encontrado.');
    }
    return product;
  }

  async update(id: number, sellerId: number, data: { name?: string; description?: string; imageUrl?: string; price?: number; stock?: number; status?: 'ATIVO' | 'INATIVO' }) {
    const product = await this.findOne(id);
    
    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('Você não tem permissão para alterar este produto.');
    }

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, sellerId: number) {
    const product = await this.findOne(id);

    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('Você não tem permissão para deletar este produto.');
    }

    // Deleção lógica para não quebrar históricos de pedidos/vendas antigos
    return this.prisma.product.update({
      where: { id },
      data: { status: 'INATIVO' },
    });
  }
  async findBySeller(
  sellerId: number
) {
  return this.prisma.product.findMany({
    where: {
      sellerId,
      status: 'ATIVO',
    },
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}
}