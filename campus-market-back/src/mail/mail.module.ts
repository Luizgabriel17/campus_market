import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailService } from './mail.service';
import { EmailProcessor } from './mail.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  providers: [MailService, EmailProcessor],
  exports: [MailService, BullModule],
})
export class MailModule {}