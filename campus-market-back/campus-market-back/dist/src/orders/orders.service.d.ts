import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createOrderDto: CreateOrderDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateOrderDto: UpdateOrderDto): string;
    remove(id: number): string;
}
