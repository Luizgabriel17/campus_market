import {
  IsInt,
  Min,
} from 'class-validator';

export class CreateCartDto {
  @IsInt()
  userId: number;

  @IsInt()
  productId: number;

  @Min(1)
  quantity: number;
}