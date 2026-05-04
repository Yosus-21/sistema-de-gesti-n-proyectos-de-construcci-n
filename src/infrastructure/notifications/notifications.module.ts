import { Module } from '@nestjs/common';
import { NOTIFICATION_PORT } from './notification.port';
import { SmtpEmailNotificationService } from './smtp-email-notification.service';

@Module({
  providers: [
    {
      provide: NOTIFICATION_PORT,
      useClass: SmtpEmailNotificationService,
    },
  ],
  exports: [NOTIFICATION_PORT],
})
export class NotificationsModule {}
