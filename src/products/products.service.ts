import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProductDto) {
  return this.prisma.produtos.create({
    data: {
      nome: data.nome,
      descricao: data.descricao,
      preco: data.preco,
      estoque: data.estoque,

      vendedor: {
        connect: {
          id: data.vendedor_id,
        },
      },
    },
  });
}

  findAll() {
    return this.prisma.produtos.findMany();
  }

  findOne(id: number) {
    return this.prisma.produtos.findUnique({
      where: { id },
    });
  }

  update(id: number, data: UpdateProductDto) {
    return this.prisma.produtos.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.produtos.delete({
      where: { id },
    });
  }
}