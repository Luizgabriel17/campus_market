import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: createPaymentDto.orderId,
      },
    });

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      );
    }

    return this.prisma.payment.create({
      data: {
        orderId: createPaymentDto.orderId,
        amount: order.total,
        method: createPaymentDto.method,
      },
    });
  }

  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        order: true,
      },
    });
  }

  async findOne(id: number) {
    const payment =
      await this.prisma.payment.findUnique({
        where: { id },

        include: {
          order: true,
        },
      });

    if (!payment) {
      throw new NotFoundException(
        'Payment not found',
      );
    }

    return payment;
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ) {
    const payment =
      await this.prisma.payment.findUnique({
        where: { id },
      });

    if (!payment) {
      throw new NotFoundException(
        'Payment not found',
      );
    }

    return this.prisma.payment.update({
      where: { id },

      data: {
        method: updatePaymentDto.method,
      },
    });
  }

  async remove(id: number) {
    const payment =
      await this.prisma.payment.findUnique({
        where: { id },
      });

    if (!payment) {
      throw new NotFoundException(
        'Payment not found',
      );
    }

    await this.prisma.payment.delete({
      where: { id },
    });

    return {
      message:
        'Payment deleted successfully',
    };
  }
}