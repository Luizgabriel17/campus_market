import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from './mail.service';
import { Logger } from '@nestjs/common';

interface EmailJob {
  email: string;
  code: string;
  userId: number;
}

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private mailService: MailService) {}

  @Process('send-verification')
  async handleSendVerificationEmail(job: Job<EmailJob>) {
    const { email, code, userId } = job.data;

    this.logger.debug(
      `Processando envio de email para usuário ${userId} (${email})`,
    );

    try {
      // Envia o email
      await this.mailService.sendVerificationCode(email, code);

      this.logger.log(
        `Email de verificação enviado com sucesso para ${email}`,
      );

      return {
        success: true,
        email,
        userId,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Erro ao enviar email para ${email}:`,
        error,
      );

      // Relança o erro para que o Bull tente novamente
      throw error;
    }
  }
}