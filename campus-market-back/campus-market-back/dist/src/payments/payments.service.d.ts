import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPaymentDto: CreatePaymentDto): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        orderId: number;
        amount: import("@prisma/client/runtime/library").Decimal;
        method: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    findAll(): Promise<({
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
    findOne(id: number): Promise<{
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
    update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<{
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
