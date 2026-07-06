import {
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateAddressDto {
  @IsOptional()
  @IsString()
  recipient?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  street: string;

  @IsString()
  number: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zipCode: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}