import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateProductDto): import(".prisma/client").Prisma.Prisma__ProductClient<{
        id: number;
        name: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        sellerId: number;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        seller: {
            id: number;
            name: string;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            googleId: string | null;
            password: string | null;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: number;
        name: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        sellerId: number;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__ProductClient<{
        seller: {
            id: number;
            name: string;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            googleId: string | null;
            password: string | null;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: number;
        name: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        sellerId: number;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateProductDto): import(".prisma/client").Prisma.Prisma__ProductClient<{
        id: number;
        name: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        sellerId: number;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__ProductClient<{
        id: number;
        name: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        sellerId: number;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
