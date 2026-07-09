import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService], // Importante: exportar para outros módulos usarem
})
export class MailModule {}