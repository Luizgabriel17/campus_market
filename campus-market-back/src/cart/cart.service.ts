import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          where: {
            product: {
              status: 'ATIVO',
            },
          },
          include: {
            product: {
              include: {
                seller: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            where: {
              product: {
                status: 'ATIVO',
              },
            },
            include: {
              product: {
                include: {
                  seller: { select: { id: true, name: true } },
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async addItem(userId: number, productId: number, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('A quantidade deve ser maior que zero.');
    }

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.status === 'INATIVO') {
      throw new NotFoundException('Lanche não encontrado.');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Quantidade solicitada maior do que o estoque disponível.');
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new BadRequestException('A soma das quantidades excede o estoque disponível.');
      }

      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  async updateItemQuantity(userId: number, productId: number, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.status === 'INATIVO') {
      throw new NotFoundException('Lanche não encontrado.');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Quantidade solicitada maior do que o estoque disponível.');
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!existingItem) {
      throw new NotFoundException('Este lanche não está no seu carrinho.');
    }

    return this.prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity },
    });
  }

  async removeItem(userId: number, productId: number) {
    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!existingItem) {
      throw new NotFoundException('Este lanche não está no seu carrinho.');
    }

    return this.prisma.cartItem.delete({
      where: { id: existingItem.id },
    });
  }

  async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    return this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}