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
exports.SellerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SellerService = class SellerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSeller(data) {
        const userExists = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (userExists) {
            throw new common_1.BadRequestException('E-mail já cadastrado.');
        }
        return this.prisma.user.create({
            data: {
                ...data,
                role: client_1.Role.VENDEDOR,
            },
            select: { id: true, name: true, email: true, role: true, status: true },
        });
    }
    async findAllSellers() {
        return this.prisma.user.findMany({
            where: { role: client_1.Role.VENDEDOR },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                status: true,
                createdAt: true,
            },
        });
    }
    async findOneSeller(id) {
        const seller = await this.prisma.user.findFirst({
            where: { id, role: client_1.Role.VENDEDOR },
            include: {
                products: true,
                reviewsReceived: true,
            },
        });
        if (!seller) {
            throw new common_1.NotFoundException('Vendedor não encontrado.');
        }
        const { password, ...result } = seller;
        return result;
    }
    async updateSeller(id, data) {
        await this.findOneSeller(id);
        return this.prisma.user.update({
            where: { id },
            data,
            select: { id: true, name: true, email: true, status: true },
        });
    }
    async removeSeller(id) {
        await this.findOneSeller(id);
        return this.prisma.user.delete({ where: { id } });
    }
    async getMyProducts(sellerId) {
        return this.prisma.product.findMany({
            where: { sellerId },
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getMyOrders(sellerId) {
        return this.prisma.order.findMany({
            where: { sellerId },
            include: {
                customer: true,
                items: { include: { product: true } },
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getDashboard(sellerId) {
        const products = await this.prisma.product.count({ where: { sellerId } });
        const orders = await this.prisma.order.count({ where: { sellerId } });
        const sales = await this.prisma.order.findMany({
            where: { sellerId },
            select: { total: true },
        });
        const revenue = sales.reduce((acc, sale) => acc + Number(sale.total), 0);
        return { products, orders, revenue };
    }
};
exports.SellerService = SellerService;
exports.SellerService = SellerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SellerService);
//# sourceMappingURL=seller.service.js.map