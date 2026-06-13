import { PrismaService } from '../prisma/prisma.service';
export declare class ProductService {
    private prisma;
    constructor(prisma: PrismaService);
    create(sellerId: number, data: {
        categoryId: number;
        name: string;
        description?: string;
        imageUrl?: string;
        price: number;
        stock: number;
    }): Promise<{
        name: string;
        id: number;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
        sellerId: number;
        categoryId: number;
        description: string | null;
        imageUrl: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
    }>;
    findAll(): Promise<({
        category: {
            name: string;
            id: number;
            createdAt: Date;
        };
        seller: {
            name: string;
            id: number;
            avatar: string;
        };
    } & {
        name: string;
        id: number;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
        sellerId: number;
        categoryId: number;
        description: string | null;
        imageUrl: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
    })[]>;
    findOne(id: number): Promise<{
        category: {
            name: string;
            id: number;
            createdAt: Date;
        };
        seller: {
            name: string;
        };
    } & {
        name: string;
        id: number;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
        sellerId: number;
        categoryId: number;
        description: string | null;
        imageUrl: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
    }>;
    update(id: number, sellerId: number, data: {
        name?: string;
        description?: string;
        imageUrl?: string;
        price?: number;
        stock?: number;
        status?: 'ATIVO' | 'INATIVO';
    }): Promise<{
        name: string;
        id: number;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
        sellerId: number;
        categoryId: number;
        description: string | null;
        imageUrl: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
    }>;
    remove(id: number, sellerId: number): Promise<{
        name: string;
        id: number;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
        sellerId: number;
        categoryId: number;
        description: string | null;
        imageUrl: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
    }>;
}
