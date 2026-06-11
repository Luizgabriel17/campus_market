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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOrderDto) {
        let total = 0;
        const itemsData = await Promise.all(createOrderDto.items.map(async (item) => {
            const product = await this.prisma.product.findUnique({
                where: {
                    id: item.productId,
                },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product ${item.productId} not found`);
            }
            total +=
                Number(product.price) * item.quantity;
            return {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: product.price,
            };
        }));
        const order = await this.prisma.order.create({
            data: {
                customerId: createOrderDto.customerId,
                sellerId: createOrderDto.sellerId,
                total,
                items: {
                    create: itemsData,
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                seller: true,
            },
        });
        return order;
    }
    async findAll() {
        return this.prisma.order.findMany({
            include: {
                customer: true,
                seller: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payment: true,
            },
        });
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                customer: true,
                seller: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payment: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const order = await this.prisma.order.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return this.prisma.order.update({
            where: { id },
            data: {
                customerId: updateOrderDto.customerId,
                sellerId: updateOrderDto.sellerId,
            },
        });
    }
    async remove(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        await this.prisma.order.delete({
            where: { id },
        });
        return {
            message: 'Order removed successfully',
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map