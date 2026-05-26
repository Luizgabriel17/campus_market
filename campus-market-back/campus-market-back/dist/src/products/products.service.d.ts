import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateProductDto): import(".prisma/client").Prisma.Prisma__produtosClient<{
        nome: string;
        id: number;
        data_criacao: Date | null;
        status: string | null;
        descricao: string | null;
        preco: import("@prisma/client/runtime/library").Decimal;
        estoque: number;
        vendedor_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        nome: string;
        id: number;
        data_criacao: Date | null;
        status: string | null;
        descricao: string | null;
        preco: import("@prisma/client/runtime/library").Decimal;
        estoque: number;
        vendedor_id: number;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__produtosClient<{
        nome: string;
        id: number;
        data_criacao: Date | null;
        status: string | null;
        descricao: string | null;
        preco: import("@prisma/client/runtime/library").Decimal;
        estoque: number;
        vendedor_id: number;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateProductDto): import(".prisma/client").Prisma.Prisma__produtosClient<{
        nome: string;
        id: number;
        data_criacao: Date | null;
        status: string | null;
        descricao: string | null;
        preco: import("@prisma/client/runtime/library").Decimal;
        estoque: number;
        vendedor_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__produtosClient<{
        nome: string;
        id: number;
        data_criacao: Date | null;
        status: string | null;
        descricao: string | null;
        preco: import("@prisma/client/runtime/library").Decimal;
        estoque: number;
        vendedor_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
