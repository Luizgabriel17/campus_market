import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class SellerService {
  constructor(private prisma: PrismaService) {}

  async createSeller(data: { name: string; email: string; password?: string }) {
    const userExists = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (userExists) {
      throw new BadRequestException('E-mail já cadastrado.');
    }

    return this.prisma.user.create({
      data: {
        ...data,
        role: Role.VENDEDOR,
      },
      select: { id: true, name: true, email: true, role: true, status: true },
    });
  }

  async findAllSellers() {
    return this.prisma.user.findMany({
      where: { role: Role.VENDEDOR },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async findOneSeller(id: number) {
    const seller = await this.prisma.user.findFirst({
      where: { id, role: Role.VENDEDOR },
      include: {
        products: true,
        reviewsReceived: true,
      },
    });

    if (!seller) {
      throw new NotFoundException('Vendedor não encontrado.');
    }

    const { password, ...result } = seller;
    return result;
  }

  async updateSeller(id: number, data: { name?: string; email?: string; status?: 'ATIVO' | 'INATIVO' }) {
    await this.findOneSeller(id); 

    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, status: true },
    });
  }

  async removeSeller(id: number) {
    await this.findOneSeller(id);
    return this.prisma.user.delete({ where: { id } });
  }

  async getMyProducts(sellerId: number) {
    return this.prisma.product.findMany({
      where: { sellerId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyOrders(sellerId: number) {
    return this.prisma.order.findMany({
      where: { sellerId },
      include: {
        customer: true,
        items: { include: { product: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDashboard(sellerId: number) {
    const products = await this.prisma.product.count({ where: { sellerId } });
    const orders = await this.prisma.order.count({ where: { sellerId } });
    const sales = await this.prisma.order.findMany({
      where: { sellerId },
      select: { total: true },
    });

    const revenue = sales.reduce((acc, sale) => acc + Number(sale.total), 0);

    return { products, orders, revenue };
  }
}