import { PrismaService } from '../prisma/prisma.service';
export declare class OrderService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(customerId: number, paymentMethod: 'PIX' | 'CASH'): Promise<{
        payment: {
            id: number;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            orderId: number;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: import(".prisma/client").$Enums.PaymentMethod;
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
    }>;
    getCustomerOrders(customerId: number): Promise<({
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
    updateOrderStatus(orderId: number, status: 'PENDENTE' | 'PAGO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO'): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        sellerId: number;
        customerId: number;
        total: import("@prisma/client/runtime/library").Decimal;
    }>;
    updatePaymentStatus(orderId: number, sellerId: number, status: 'PENDENTE' | 'APROVADO' | 'RECUSADO'): Promise<{
        payment: {
            id: number;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            orderId: number;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: import(".prisma/client").$Enums.PaymentMethod;
        };
    } & {
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        sellerId: number;
        customerId: number;
        total: import("@prisma/client/runtime/library").Decimal;
    }>;
}
