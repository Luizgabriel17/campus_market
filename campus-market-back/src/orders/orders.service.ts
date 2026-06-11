import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    let total = 0;

    const itemsData = await Promise.all(
      createOrderDto.items.map(async (item) => {
        const product =
          await this.prisma.product.findUnique({
            where: {
              id: item.productId,
            },
          });

        if (!product) {
          throw new NotFoundException(
            `Product ${item.productId} not found`,
          );
        }

        total +=
          Number(product.price) * item.quantity;

        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
        };
      }),
    );

    const order = await this.prisma.order.create({
      data: {
        customerId: createOrderDto.customerId,
        sellerId: createOrderDto.sellerId,
        total,

        items: {
          create: itemsData,
        },
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },

        customer: true,
        seller: true,
      },
    });

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        customer: true,
        seller: true,

        items: {
          include: {
            product: true,
          },
        },

        payment: true,
      },
    });
  }

  async findOne(id: number) {
    const order =
      await this.prisma.order.findUnique({
        where: { id },

        include: {
          customer: true,
          seller: true,

          items: {
            include: {
              product: true,
            },
          },

          payment: true,
        },
      });

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      );
    }

    return order;
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ) {
    const order =
      await this.prisma.order.findUnique({
        where: { id },
      });

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      );
    }

    return this.prisma.order.update({
  where: { id },

  data: {
    customerId: updateOrderDto.customerId,
    sellerId: updateOrderDto.sellerId,
  },
});
  }

  async remove(id: number) {
    const order =
      await this.prisma.order.findUnique({
        where: { id },
      });

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      );
    }

    await this.prisma.order.delete({
      where: { id },
    });

    return {
      message:
        'Order removed successfully',
    };
  }
}