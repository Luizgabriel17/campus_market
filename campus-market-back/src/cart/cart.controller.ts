import { Controller, Get, Post, Put, Delete, Body, Request, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req: any) {
    return this.cartService.getOrCreateCart(req.user.userId);
  }

  @Post('items')
  addItem(
    @Request() req: any,
    @Body() body: { productId: number; quantity: number },
  ) {
    return this.cartService.addItem(req.user.userId, body.productId, body.quantity);
  }

  @Put('items/:productId')
  updateQuantity(
    @Param('productId', ParseIntPipe) productId: number,
    @Request() req: any,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateItemQuantity(req.user.userId, productId, body.quantity);
  }

  @Delete('items/:productId')
  removeItem(
    @Param('productId', ParseIntPipe) productId: number,
    @Request() req: any,
  ) {
    return this.cartService.removeItem(req.user.userId, productId);
  }

  @Delete()
  clearCart(@Request() req: any) {
    return this.cartService.clearCart(req.user.userId);
  }
}