import { IsEnum,IsEmail, MinLength, IsNotEmpty, IsString } from 'class-validator';

export enum UserRole {
  CLIENTE = 'CLIENTE',
  VENDEDOR = 'VENDEDOR',
  ADMIN = 'ADMIN'
}

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty({ message: 'O tipo de usuário é obrigatório' })
  @IsEnum(UserRole, { message: 'Tipo de usuário inválido' })
  role: UserRole;
}