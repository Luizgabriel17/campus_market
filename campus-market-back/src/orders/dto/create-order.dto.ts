import {
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  customerId: number;

  @IsInt()
  sellerId: number;

  @IsArray()
  items: {
    productId: number;
    quantity: number;
  }[];
}