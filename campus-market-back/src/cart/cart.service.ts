import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async create(createCartDto: CreateCartDto) {
    let cart = await this.prisma.cart.findUnique({
      where: {
        userId: createCartDto.userId,
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId: createCartDto.userId,
        },
      });
    }

    const existingItem =
      await this.prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: createCartDto.productId,
        },
      });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },

        data: {
          quantity:
            existingItem.quantity +
            createCartDto.quantity,
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: createCartDto.productId,
        quantity: createCartDto.quantity,
      },
    });
  }

  async findAll() {
    return this.prisma.cart.findMany({
      include: {
        user: true,

        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findOne(userId: number) {
    const cart =
      await this.prisma.cart.findUnique({
        where: {
          userId,
        },

        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

    if (!cart) {
      throw new NotFoundException(
        'Cart not found',
      );
    }

    return cart;
  }

  async update(
    id: number,
    updateCartDto: UpdateCartDto,
  ) {
    return this.prisma.cartItem.update({
      where: { id },

      data: {
        quantity: updateCartDto.quantity,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.cartItem.delete({
      where: { id },
    });

    return {
      message:
        'Item removed from cart',
    };
  }
}