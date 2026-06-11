import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateProductDto): Promise<{
        category: {
            name: string;
            id: number;
            createdAt: Date;
        };
        seller: {
            name: string;
            email: string;
            password: string | null;
            id: number;
            googleId: string | null;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        name: string;
        id: number;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        categoryId: number;
        sellerId: number;
        imageUrl: string | null;
    }>;
    findAll(): Promise<({
        category: {
            name: string;
            id: number;
            createdAt: Date;
        };
        seller: {
            name: string;
            email: string;
            password: string | null;
            id: number;
            googleId: string | null;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        name: string;
        id: number;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        categoryId: number;
        sellerId: number;
        imageUrl: string | null;
    })[]>;
    findOne(id: number): Promise<{
        category: {
            name: string;
            id: number;
            createdAt: Date;
        };
        seller: {
            name: string;
            email: string;
            password: string | null;
            id: number;
            googleId: string | null;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        name: string;
        id: number;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        categoryId: number;
        sellerId: number;
        imageUrl: string | null;
    }>;
    update(id: number, data: UpdateProductDto): Promise<{
        category: {
            name: string;
            id: number;
            createdAt: Date;
        };
        seller: {
            name: string;
            email: string;
            password: string | null;
            id: number;
            googleId: string | null;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        name: string;
        id: number;
        status: import(".prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        categoryId: number;
        sellerId: number;
        imageUrl: string | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
