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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, role) {
        if (role === 'ADMIN') {
            return this.prisma.payment.findMany({
                include: { order: true },
                orderBy: { createdAt: 'desc' },
            });
        }
        if (role === 'VENDEDOR') {
            return this.prisma.payment.findMany({
                where: {
                    order: { sellerId: userId },
                },
                include: { order: true },
                orderBy: { createdAt: 'desc' },
            });
        }
        return this.prisma.payment.findMany({
            where: {
                order: { customerId: userId },
            },
            include: { order: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId, role) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: { order: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (role !== 'ADMIN' &&
            payment.order.sellerId !== userId &&
            payment.order.customerId !== userId) {
            throw new common_1.ForbiddenException('Você não tem permissão para ver este pagamento.');
        }
        return payment;
    }
    async update(id, userId, role, updatePaymentDto) {
        const payment = await this.findOne(id, userId, role);
        if (role !== 'ADMIN' && payment.order.sellerId !== userId) {
            throw new common_1.ForbiddenException('Apenas o vendedor deste pedido ou o administrador podem alterar o método.');
        }
        return this.prisma.payment.update({
            where: { id },
            data: {
                method: updatePaymentDto.method,
            },
        });
    }
    async remove(id) {
        const payment = await this.prisma.payment.findUnique({ where: { id } });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        await this.prisma.payment.delete({ where: { id } });
        return { message: 'Payment deleted successfully' };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map