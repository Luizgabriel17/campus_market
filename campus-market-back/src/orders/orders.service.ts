import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private whatsapp: WhatsappService,
  ) {}

  async createOrder(
    customerId: number,
    paymentMethod: 'PIX' | 'CASH',
    deliveryAddressId: string,
    notes?: string,
    deliveryTime?: string,
  ) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId: customerId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Seu carrinho está vazio.');
    }

    const address = await this.prisma.address.findUnique({
      where: { id: deliveryAddressId },
    });

    if (!address) {
      throw new BadRequestException('Endereço não encontrado.');
    }

    if (address.userId !== customerId) {
      throw new ForbiddenException('Este endereço não pertence a você.');
    }

    const sellerId = cart.items[0].product.sellerId;
    const sameSeller = cart.items.every(
      (item) => item.product.sellerId === sellerId,
    );

    if (!sameSeller) {
      throw new BadRequestException(
        'Você só pode fazer pedido de um vendedor por vez no carrinho.',
      );
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Estoque insuficiente para o lanche: ${item.product.name}`,
        );
      }
    }

    const total = cart.items.reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity,
      0,
    );

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customerId,
          sellerId,
          total,
          status: 'PENDENTE',
          deliveryAddressId,
          notes: notes ?? null,
          deliveryTime: deliveryTime ?? null,
        },
      });

      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
          },
        });

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.payment.create({
        data: {
          orderId: order.id,
          amount: total,
          method: paymentMethod,
          status: 'PENDENTE',
        },
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: { include: { product: true } },
          payment: true,
          deliveryAddress: true,
        },
      });
    });
  }

  async getCustomerOrders(customerId: number) {
    return this.prisma.order.findMany({
      where: { customerId },
      include: {
        seller: { select: { name: true, phone: true } },
        items: { include: { product: true } },
        payment: true,
        deliveryAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(
    orderId: number,
    status: 'PENDENTE' | 'PAGO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO',
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async updatePaymentStatus(
    orderId: number,
    sellerId: number,
    status: 'PENDENTE' | 'APROVADO' | 'RECUSADO',
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    if (order.sellerId !== sellerId) {
      throw new ForbiddenException('Este pedido não pertence a você.');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { orderId },
        data: { status },
      });

      if (status === 'APROVADO') {
        await tx.order.update({
          where: { id: orderId },
          data: { status: 'PAGO' },
        });
      }

      return tx.order.findUnique({
        where: { id: orderId },
        include: {
          payment: true,
          deliveryAddress: true,
          items: { include: { product: true } },
        },
      });
    });
  }

  async confirmOrder(orderId: number, sellerId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        seller: { select: { name: true } },
        items: { include: { product: true } },
        deliveryAddress: true,
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    if (order.sellerId !== sellerId) {
      throw new ForbiddenException('Este pedido não pertence a você.');
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'ENTREGUE' },
    });

    const whatsappUrl = this.whatsapp.buildOrderConfirmationUrl({
      id: order.id,
      total: order.total.toString(), // Decimal → string
      notes: order.notes,
      deliveryTime: order.deliveryTime,
      customer: order.customer,
      seller: order.seller,
      items: order.items,
      deliveryAddress: order.deliveryAddress,
      payment: order.payment,
    });

    return {
      message: 'Pedido confirmado como entregue.',
      whatsappUrl,
    };
  }

  async getSellerOrders(sellerId: number) {
    return this.prisma.order.findMany({
      where: { sellerId },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        items: { include: { product: true } },
        payment: true,
        deliveryAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}