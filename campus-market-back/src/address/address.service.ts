import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    userId: number,
    dto: CreateAddressDto,
  ) {
    const addresses =
      await this.prisma.address.count({
        where: {
          userId,
        },
      });

    const isDefault =
      dto.isDefault ?? addresses === 0;

    if (isDefault) {
      await this.prisma.address.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    return this.prisma.address.create({
      data: {
        ...dto,
        isDefault,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          isDefault: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  async findOne(
    id: string,
    userId: number,
  ) {
    const address =
      await this.prisma.address.findUnique({
        where: {
          id,
        },
      });

    if (!address) {
      throw new NotFoundException(
        'Endereço não encontrado.',
      );
    }

    if (address.userId !== userId) {
      throw new ForbiddenException(
        'Este endereço não pertence a você.',
      );
    }

    return address;
  }

  async update(
    id: string,
    userId: number,
    dto: UpdateAddressDto,
  ) {
    await this.findOne(id, userId);

    if (dto.isDefault === true) {
      await this.prisma.address.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    return this.prisma.address.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(
    id: string,
    userId: number,
  ) {
    const address =
      await this.findOne(id, userId);

    await this.prisma.address.delete({
      where: {
        id,
      },
    });

    if (address.isDefault) {
      const nextAddress =
        await this.prisma.address.findFirst({
          where: {
            userId,
          },
          orderBy: {
            createdAt: 'asc',
          },
        });

      if (nextAddress) {
        await this.prisma.address.update({
          where: {
            id: nextAddress.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }

    return {
      message:
        'Endereço removido com sucesso.',
    };
  }
}