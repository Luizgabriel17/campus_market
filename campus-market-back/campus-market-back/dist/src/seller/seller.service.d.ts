import { PrismaService } from '../prisma/prisma.service';
export declare class SellerService {
    private prisma;
    constructor(prisma: PrismaService);
    createSeller(data: {
        name: string;
        email: string;
        password?: string;
    }): Promise<{
        name: string;
        email: string;
        id: number;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
    findAllSellers(): Promise<{
        name: string;
        email: string;
        id: number;
        avatar: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }[]>;
    findOneSeller(id: number): Promise<{
        products: {
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
        }[];
        reviewsReceived: {
            id: number;
            createdAt: Date;
            sellerId: number;
            customerId: number;
            rating: number;
            comment: string | null;
        }[];
        name: string;
        email: string;
        id: number;
        googleId: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateSeller(id: number, data: {
        name?: string;
        email?: string;
        status?: 'ATIVO' | 'INATIVO';
    }): Promise<{
        name: string;
        email: string;
        id: number;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
    removeSeller(id: number): Promise<{
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
    }>;
    getMyProducts(sellerId: number): Promise<({
        category: {
            name: string;
            id: number;
            createdAt: Date;
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
    getMyOrders(sellerId: number): Promise<({
        payment: {
            id: number;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            orderId: number;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: import(".prisma/client").$Enums.PaymentMethod;
        };
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
        items: ({
            product: {
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
            };
        } & {
            id: number;
            productId: number;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            orderId: number;
        })[];
    } & {
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        sellerId: number;
        customerId: number;
        total: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    getDashboard(sellerId: number): Promise<{
        products: number;
        orders: number;
        revenue: number;
    }>;
}
