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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrderService = class OrderService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(customerId, paymentMethod) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId: customerId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Seu carrinho está vazio.');
        }
        const sellerId = cart.items[0].product.sellerId;
        const sameSeller = cart.items.every(item => item.product.sellerId === sellerId);
        if (!sameSeller) {
            throw new common_1.BadRequestException('Você só pode fazer pedido de um vendedor por vez no carrinho.');
        }
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Estoque insuficiente para o lanche: ${item.product.name}`);
            }
        }
        const total = cart.items.reduce((acc, item) => {
            return acc + (Number(item.product.price) * item.quantity);
        }, 0);
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    customerId,
                    sellerId,
                    total,
                    status: 'PENDENTE',
                },
            });
            for (const item of cart.items) {
                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.product.price,
                    },
                });
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }
            await tx.payment.create({
                data: {
                    orderId: order.id,
                    amount: total,
                    method: paymentMethod,
                    status: 'PENDENTE',
                },
            });
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
            return tx.order.findUnique({
                where: { id: order.id },
                include: {
                    items: { include: { product: true } },
                    payment: true,
                },
            });
        });
    }
    async getCustomerOrders(customerId) {
        return this.prisma.order.findMany({
            where: { customerId },
            include: {
                seller: { select: { name: true } },
                items: { include: { product: true } },
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            throw new common_1.NotFoundException('Pedido não encontrado.');
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
    }
    async updatePaymentStatus(orderId, sellerId, status) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { payment: true }
        });
        if (!order) {
            throw new common_1.NotFoundException('Pedido não encontrado.');
        }
        if (order.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('Este pedido não pertence a você.');
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where: { orderId },
                data: { status },
            });
            if (status === 'APROVADO') {
                await tx.order.update({
                    where: { id: orderId },
                    data: { status: 'PAGO' },
                });
            }
            return tx.order.findUnique({
                where: { id: orderId },
                include: { payment: true }
            });
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderService);
//# sourceMappingURL=orders.service.js.map