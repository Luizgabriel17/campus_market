import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';

import { SellerService } from './seller.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post()
  create(@Body() createSellerDto: { name: string; email: string; password?: string }) {
    return this.sellerService.createSeller(createSellerDto);
  }

  @Get()
  findAll() {
    return this.sellerService.findAllSellers();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.findOneSeller(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSellerDto: { name?: string; email?: string; status?: 'ATIVO' | 'INATIVO' },
  ) {
    return this.sellerService.updateSeller(id, updateSellerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.removeSeller(id);
  }

  @Get('me/products')
  getMyProducts(@Request() req: any) {
    return this.sellerService.getMyProducts(req.user.userId);
  }

  @Get('me/orders')
  getMyOrders(@Request() req: any) {
    return this.sellerService.getMyOrders(req.user.userId);
  }

  @Get('me/dashboard')
  getDashboard(@Request() req: any) {
    return this.sellerService.getDashboard(req.user.userId);
  }
}