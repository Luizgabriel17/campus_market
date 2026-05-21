import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  nome: string;

  @IsString()
  descricao: string;

  @IsNumber()
  preco: number;

  @IsNumber()
  estoque: number;

  @IsNumber()
  vendedor_id: number;
}