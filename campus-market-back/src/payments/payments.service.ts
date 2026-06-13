import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number, role: string) {
    if (role === 'ADMIN') {
      return this.prisma.payment.findMany({
        include: { order: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (role === 'VENDEDOR') {
      return this.prisma.payment.findMany({
        where: {
          order: { sellerId: userId },
        },
        include: { order: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.payment.findMany({
      where: {
        order: { customerId: userId },
      },
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number, role: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (
      role !== 'ADMIN' &&
      payment.order.sellerId !== userId &&
      payment.order.customerId !== userId
    ) {
      throw new ForbiddenException('Você não tem permissão para ver este pagamento.');
    }

    return payment;
  }

  async update(id: number, userId: number, role: string, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.findOne(id, userId, role);

    if (role !== 'ADMIN' && payment.order.sellerId !== userId) {
      throw new ForbiddenException('Apenas o vendedor deste pedido ou o administrador podem alterar o método.');
    }

    return this.prisma.payment.update({
      where: { id },
      data: {
        method: updatePaymentDto.method,
      },
    });
  }

  async remove(id: number) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.prisma.payment.delete({ where: { id } });
    return { message: 'Payment deleted successfully' };
  }
}