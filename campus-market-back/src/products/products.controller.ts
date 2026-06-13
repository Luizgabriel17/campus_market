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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductService } from './products.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'ADMIN')
  create(
    @Request() req: any,
    @Body() data: { categoryId: number; name: string; description?: string; imageUrl?: string; price: number; stock: number },
  ) {
    return this.productService.create(req.user.userId, data);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'ADMIN')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { imageUrl: `/uploads/${file.filename}` };
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Body() data: { name?: string; description?: string; imageUrl?: string; price?: number; stock?: number; status?: 'ATIVO' | 'INATIVO' },
  ) {
    return this.productService.update(id, req.user.userId, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'ADMIN')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.productService.remove(id, req.user.userId);
  }
}