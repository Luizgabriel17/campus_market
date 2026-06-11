import { PrismaService } from '../prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCartDto: CreateCartDto): Promise<{
        id: number;
        productId: number;
        quantity: number;
        cartId: number;
    }>;
    findAll(): Promise<({
        user: {
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
            cartId: number;
        })[];
    } & {
        id: number;
        userId: number;
    })[]>;
    findOne(userId: number): Promise<{
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
            cartId: number;
        })[];
    } & {
        id: number;
        userId: number;
    }>;
    update(id: number, updateCartDto: UpdateCartDto): Promise<{
        id: number;
        productId: number;
        quantity: number;
        cartId: number;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
