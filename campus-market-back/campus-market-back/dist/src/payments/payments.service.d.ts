import { PrismaService } from '../prisma/prisma.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: number, role: string): Promise<({
        order: {
            id: number;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            sellerId: number;
            customerId: number;
            total: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: number;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        orderId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        method: import(".prisma/client").$Enums.PaymentMethod;
    })[]>;
    findOne(id: number, userId: number, role: string): Promise<{
        order: {
            id: number;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            sellerId: number;
            customerId: number;
            total: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: number;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        orderId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        method: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    update(id: number, userId: number, role: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        orderId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        method: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
