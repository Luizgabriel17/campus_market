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
import { memoryStorage } from 'multer';
import { ProductService } from './products.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'ADMIN')
  async create(
    @Request() req: any,
    @Body() body: any,
  ) {
    console.log('Received product creation request:', req);
    console.log('Received product creation request:', body);
    const productData = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      stock: parseInt(body.stock, 10),
      categoryId: parseInt(body.categoryId, 10),
      imageUrl: body.imageUrl || undefined,
    };

    return this.productService.create(req.user.userId, productData);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('seller/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'ADMIN')
  findMyProducts(@Request() req: any) {
    return this.productService.findBySeller(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Body() body: any,
  ) {
    const updateData: any = {};

    if (body.name) updateData.name = body.name;
    if (body.description) updateData.description = body.description;
    if (body.price) updateData.price = parseFloat(body.price);
    if (body.stock) updateData.stock = parseInt(body.stock, 10);
    if (body.categoryId) updateData.categoryId = parseInt(body.categoryId, 10);
    if (body.imageUrl) updateData.imageUrl = body.imageUrl;

    return this.productService.update(id, req.user.userId, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'ADMIN')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.productService.remove(id, req.user.userId);
  }
}