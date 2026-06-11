import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createOrderDto: CreateOrderDto): Promise<{
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
        items: ({
            product: {
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
            };
        } & {
            id: number;
            productId: number;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            orderId: number;
        })[];
        customer: {
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
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        sellerId: number;
        customerId: number;
        total: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(): Promise<({
        payment: {
            id: number;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            orderId: number;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: import(".prisma/client").$Enums.PaymentMethod;
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
        items: ({
            product: {
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
            };
        } & {
            id: number;
            productId: number;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            orderId: number;
        })[];
        customer: {
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
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        sellerId: number;
        customerId: number;
        total: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findOne(id: number): Promise<{
        payment: {
            id: number;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            orderId: number;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: import(".prisma/client").$Enums.PaymentMethod;
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
        items: ({
            product: {
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
            };
        } & {
            id: number;
            productId: number;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            orderId: number;
        })[];
        customer: {
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
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        sellerId: number;
        customerId: number;
        total: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: number, updateOrderDto: UpdateOrderDto): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        sellerId: number;
        customerId: number;
        total: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
