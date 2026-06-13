import { OrderService } from './orders.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(req: any, body: {
        method: 'PIX' | 'CASH';
    }): Promise<{
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
            orderId: number;
            productId: number;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        sellerId: number;
        customerId: number;
        total: import("@prisma/client/runtime/library").Decimal;
    }>;
    getCustomerOrders(req: any): Promise<({
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
            orderId: number;
            productId: number;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        sellerId: number;
        customerId: number;
        total: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    updateStatus(id: number, body: {
        status: 'PENDENTE' | 'PAGO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';
    }): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        sellerId: number;
        customerId: number;
        total: import("@prisma/client/runtime/library").Decimal;
    }>;
    updatePayment(id: number, req: any, body: {
        status: 'PENDENTE' | 'APROVADO' | 'RECUSADO';
    }): Promise<{
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
