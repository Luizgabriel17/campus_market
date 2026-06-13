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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductService = class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(sellerId, data) {
        return this.prisma.product.create({
            data: {
                ...data,
                sellerId,
            },
        });
    }
    async findAll() {
        return this.prisma.product.findMany({
            where: { status: 'ATIVO' },
            include: {
                seller: { select: { id: true, name: true, avatar: true } },
                category: true,
            },
        });
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { seller: { select: { name: true } }, category: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Lanche não encontrado.');
        }
        return product;
    }
    async update(id, sellerId, data) {
        const product = await this.findOne(id);
        if (product.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('Você não tem permissão para alterar este produto.');
        }
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }
    async remove(id, sellerId) {
        const product = await this.findOne(id);
        if (product.sellerId !== sellerId) {
            throw new common_1.ForbiddenException('Você não tem permissão para deletar este produto.');
        }
        return this.prisma.product.update({
            where: { id },
            data: { status: 'INATIVO' },
        });
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=products.service.js.map