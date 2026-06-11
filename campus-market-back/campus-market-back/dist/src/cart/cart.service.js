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
    async create(createCartDto) {
        let cart = await this.prisma.cart.findUnique({
            where: {
                userId: createCartDto.userId,
            },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    userId: createCartDto.userId,
                },
            });
        }
        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: createCartDto.productId,
            },
        });
        if (existingItem) {
            return this.prisma.cartItem.update({
                where: {
                    id: existingItem.id,
                },
                data: {
                    quantity: existingItem.quantity +
                        createCartDto.quantity,
                },
            });
        }
        return this.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: createCartDto.productId,
                quantity: createCartDto.quantity,
            },
        });
    }
    async findAll() {
        return this.prisma.cart.findMany({
            include: {
                user: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    async findOne(userId) {
        const cart = await this.prisma.cart.findUnique({
            where: {
                userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        return cart;
    }
    async update(id, updateCartDto) {
        return this.prisma.cartItem.update({
            where: { id },
            data: {
                quantity: updateCartDto.quantity,
            },
        });
    }
    async remove(id) {
        await this.prisma.cartItem.delete({
            where: { id },
        });
        return {
            message: 'Item removed from cart',
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map