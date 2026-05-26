import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsString({
    message: 'Nome inválido',
  })
  @MinLength(3, {
    message:
      'Nome deve ter no mínimo 3 caracteres',
  })
  @MaxLength(100, {
    message:
      'Nome muito grande',
    })
  nome: string;

  @IsEmail(
    {},
    {
      message: 'Email inválido',
    },
  )
  email: string;

  @IsString({
    message: 'Senha inválida',
  })
  @MinLength(6, {
    message:
      'Senha deve ter no mínimo 6 caracteres',
  })
  senha: string;
}