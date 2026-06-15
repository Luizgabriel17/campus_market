import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum UserRole {
  CLIENTE = 'CLIENTE',
  VENDEDOR = 'VENDEDOR',
  ADMIN = 'ADMIN'
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional() 
  @IsString()
  password?: string;

  @IsOptional() 
  @IsEnum(UserRole)
  role?: UserRole;
}