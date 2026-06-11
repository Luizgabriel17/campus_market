export declare class CreateOrderDto {
    customerId: number;
    sellerId: number;
    items: {
        productId: number;
        quantity: number;
    }[];
}
