import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email.service';
import { WhatsAppService } from './whatsapp.service';
import { NotificationsController } from './notifications.controller';

@Module({
  providers: [NotificationsService, EmailService, WhatsAppService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
