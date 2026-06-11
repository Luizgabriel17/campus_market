"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const sellerExists = await this.prisma.user.findUnique({
            where: { id: data.sellerId },
        });
        if (!sellerExists) {
            throw new common_1.NotFoundException('Seller not found');
        }
        const categoryExists = await this.prisma.category.findUnique({
            where: { id: data.categoryId },
        });
        if (!categoryExists) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (data.price <= 0) {
            throw new common_1.BadRequestException('Price must be greater than 0');
        }
        if (data.stock < 0) {
            throw new common_1.BadRequestException('Stock cannot be negative');
        }
        const product = await this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                imageUrl: data.imageUrl,
                price: data.price,
                stock: data.stock,
                sellerId: data.sellerId,
                categoryId: data.categoryId,
            },
            include: {
                seller: true,
                category: true,
            },
        });
        return product;
    }
    async findAll() {
        const products = await this.prisma.product.findMany({
            include: {
                seller: true,
                category: true,
            },
        });
        return products;
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                seller: true,
                category: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async update(id, data) {
        const productExists = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!productExists) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (data.sellerId) {
            const sellerExists = await this.prisma.user.findUnique({
                where: { id: data.sellerId },
            });
            if (!sellerExists) {
                throw new common_1.NotFoundException('Seller not found');
            }
        }
        if (data.categoryId) {
            const categoryExists = await this.prisma.category.findUnique({
                where: { id: data.categoryId },
            });
            if (!categoryExists) {
                throw new common_1.NotFoundException('Category not found');
            }
        }
        if (data.price !== undefined && data.price <= 0) {
            throw new common_1.BadRequestException('Price must be greater than 0');
        }
        if (data.stock !== undefined && data.stock < 0) {
            throw new common_1.BadRequestException('Stock cannot be negative');
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data,
            include: {
                seller: true,
                category: true,
            },
        });
        return updatedProduct;
    }
    async remove(id) {
        const productExists = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!productExists) {
            throw new common_1.NotFoundException('Product not found');
        }
        await this.prisma.product.delete({
            where: { id },
        });
        return { message: 'Product deleted successfully' };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map