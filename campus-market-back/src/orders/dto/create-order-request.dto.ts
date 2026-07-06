import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateOrderRequestDto {
  @IsIn(['PIX', 'CASH'])
  method: 'PIX' | 'CASH';

  @IsString()
  deliveryAddressId: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  deliveryTime?: string;
}