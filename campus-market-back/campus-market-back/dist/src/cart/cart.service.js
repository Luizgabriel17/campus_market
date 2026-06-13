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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCart(userId) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                seller: { select: { id: true, name: true } },
                            },
                        },
                    },
                },
            },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: {
                                include: {
                                    seller: { select: { id: true, name: true } },
                                },
                            },
                        },
                    },
                },
            });
        }
        return cart;
    }
    async addItem(userId, productId, quantity) {
        if (quantity <= 0) {
            throw new common_1.BadRequestException('A quantidade deve ser maior que zero.');
        }
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            throw new common_1.NotFoundException('Lanche não encontrado.');
        }
        if (product.stock < quantity) {
            throw new common_1.BadRequestException('Quantidade solicitada maior do que o estoque disponível.');
        }
        const cart = await this.getOrCreateCart(userId);
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock < newQuantity) {
                throw new common_1.BadRequestException('A soma das quantidades excede o estoque disponível.');
            }
            return this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
            });
        }
        return this.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity,
            },
        });
    }
    async updateItemQuantity(userId, productId, quantity) {
        if (quantity <= 0) {
            return this.removeItem(userId, productId);
        }
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            throw new common_1.NotFoundException('Lanche não encontrado.');
        }
        if (product.stock < quantity) {
            throw new common_1.BadRequestException('Quantidade solicitada maior do que o estoque disponível.');
        }
        const cart = await this.getOrCreateCart(userId);
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });
        if (!existingItem) {
            throw new common_1.NotFoundException('Este lanche não está no seu carrinho.');
        }
        return this.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity },
        });
    }
    async removeItem(userId, productId) {
        const cart = await this.getOrCreateCart(userId);
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });
        if (!existingItem) {
            throw new common_1.NotFoundException('Este lanche não está no seu carrinho.');
        }
        return this.prisma.cartItem.delete({
            where: { id: existingItem.id },
        });
    }
    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        return this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map