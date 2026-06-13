import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno no banco de dados do Campus Market.';

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = `O campo ${exception.meta?.target} já está cadastrado.`;
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Não é possível excluir este registro pois ele está vinculado a outros dados.';
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'O registro solicitado não foi encontrado no banco.';
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.code,
    });
  }
}