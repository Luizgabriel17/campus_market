import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<{
        items: ({
            product: {
                seller: {
                    name: string;
                    id: number;
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
            };
        } & {
            id: number;
            productId: number;
            quantity: number;
            cartId: number;
        })[];
    } & {
        id: number;
        userId: number;
    }>;
    addItem(req: any, body: {
        productId: number;
        quantity: number;
    }): Promise<{
        id: number;
        productId: number;
        quantity: number;
        cartId: number;
    }>;
    updateQuantity(productId: number, req: any, body: {
        quantity: number;
    }): Promise<{
        id: number;
        productId: number;
        quantity: number;
        cartId: number;
    }>;
    removeItem(productId: number, req: any): Promise<{
        id: number;
        productId: number;
        quantity: number;
        cartId: number;
    }>;
    clearCart(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
