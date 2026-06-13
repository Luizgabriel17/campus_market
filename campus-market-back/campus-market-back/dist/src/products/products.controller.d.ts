import { ProductService } from './products.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(req: any, data: {
        categoryId: number;
        name: string;
        description?: string;
        imageUrl?: string;
        price: number;
        stock: number;
    }): Promise<{
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
    }>;
    uploadFile(file: Express.Multer.File): {
        imageUrl: string;
    };
    findAll(): Promise<({
        category: {
            name: string;
            id: number;
            createdAt: Date;
        };
        seller: {
            name: string;
            id: number;
            avatar: string;
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
    findOne(id: number): Promise<{
        category: {
            name: string;
            id: number;
            createdAt: Date;
        };
        seller: {
            name: string;
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
    }>;
    update(id: number, req: any, data: {
        name?: string;
        description?: string;
        imageUrl?: string;
        price?: number;
        stock?: number;
        status?: 'ATIVO' | 'INATIVO';
    }): Promise<{
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
    }>;
    remove(id: number, req: any): Promise<{
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
    }>;
}
