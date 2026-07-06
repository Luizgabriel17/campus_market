import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from "bcrypt";
import { UpdatePasswordDto } from './dto/update.password.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(id: number) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    include: {
      addresses: {
        orderBy: {
          isDefault: 'desc',
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundException(
      'Usuário não encontrado.',
    );
  }

  const { password, ...result } = user;

  return result;
}

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        phone: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: number) {
  await this.findOne(id);

  await this.prisma.user.update({
    where: { id },
    data: {
      status: 'INATIVO',
    },
  });

  return {
    message:
      'Conta desativada com sucesso.',
  };
}

  async findVendors() {
    return this.prisma.user.findMany({
      where: { role: 'VENDEDOR' },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    });
  }
  async changePassword(
  id: number,
  dto: UpdatePasswordDto,
) {
  const user =
    await this.prisma.user.findUnique({
      where: { id },
    });

  if (!user) {
    throw new NotFoundException(
      'Usuário não encontrado.',
    );
  }

  const valid =
    await bcrypt.compare(
      dto.currentPassword,
      user.password!,
    );

  if (!valid) {
    throw new BadRequestException(
      'Senha atual incorreta.',
    );
  }

  const hash =
    await bcrypt.hash(
      dto.newPassword,
      10,
    );

  await this.prisma.user.update({
    where: { id },
    data: {
      password: hash,
    },
  });

  return {
    message:
      'Senha alterada com sucesso.',
  };
}
async updateAvatar(
  id: number,
  avatar: string,
) {
  await this.findOne(id);

  return this.prisma.user.update({
    where: { id },
    data: {
      avatar,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      phone: true,
    },
  });
}
}