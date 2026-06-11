import { PaymentMethod } from '@prisma/client';
export declare class CreatePaymentDto {
    orderId: number;
    method: PaymentMethod;
}
