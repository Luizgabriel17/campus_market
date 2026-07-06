import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Request,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(
    @Request() req: any,
    @Body() body: CreateOrderRequestDto,
  ) {
    return this.orderService.createOrder(
      req.user.userId,
      body.method,
      body.deliveryAddressId,
      body.notes,
      body.deliveryTime,
    );
  }

  @UseGuards(RolesGuard)
  @Roles('VENDEDOR', 'ADMIN')
  @Get('seller')
  getSellerOrders(@Request() req: any) {
    return this.orderService.getSellerOrders(req.user.userId);
  }

  @Get('my-purchases')
  getCustomerOrders(@Request() req: any) {
    return this.orderService.getCustomerOrders(req.user.userId);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: 'PENDENTE' | 'PAGO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO' },
  ) {
    return this.orderService.updateOrderStatus(id, body.status);
  }

  @Put(':id/payment')
  @UseGuards(RolesGuard)
  @Roles('VENDEDOR', 'ADMIN')
  updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Body() body: { status: 'PENDENTE' | 'APROVADO' | 'RECUSADO' },
  ) {
    return this.orderService.updatePaymentStatus(id, req.user.userId, body.status);
  }

  @Put(':id/confirm')
  @UseGuards(RolesGuard)
  @Roles('VENDEDOR', 'ADMIN')
  confirmOrder(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.orderService.confirmOrder(id, req.user.userId);
  }
}