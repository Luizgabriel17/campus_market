import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Apenas usuários logados (Admin/Vendedor) criam categorias
  create(@Body() data: { name: string }) {
    return this.categoryService.create(data);
  }

  @Get() // Aberto para os alunos verem o cardápio
  findAll() {
    return this.categoryService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}