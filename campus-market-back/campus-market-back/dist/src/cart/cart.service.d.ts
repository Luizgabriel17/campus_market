import { PrismaService } from '../prisma/prisma.service';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getOrCreateCart(userId: number): Promise<{
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
            cartId: number;
            productId: number;
            quantity: number;
        })[];
    } & {
        id: number;
        userId: number;
    }>;
    addItem(userId: number, productId: number, quantity: number): Promise<{
        id: number;
        cartId: number;
        productId: number;
        quantity: number;
    }>;
    updateItemQuantity(userId: number, productId: number, quantity: number): Promise<{
        id: number;
        cartId: number;
        productId: number;
        quantity: number;
    }>;
    removeItem(userId: number, productId: number): Promise<{
        id: number;
        cartId: number;
        productId: number;
        quantity: number;
    }>;
    clearCart(userId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
