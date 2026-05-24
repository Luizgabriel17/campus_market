import {
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail(
    {},
    {
      message: 'Email inválido',
    },
  )
  email: string;

  @IsString({
    message: 'Senha deve ser texto',
  })
  @MinLength(6, {
    message:
      'Senha deve ter no mínimo 6 caracteres',
  })
  senha: string;
}