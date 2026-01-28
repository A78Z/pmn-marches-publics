import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScrapingModule } from './scraping/scraping.module';
import { ParseModule } from './parse/parse.module';
import { ClassificationModule } from './classification/classification.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthController } from './health.controller';
import configuration from './config/configuration';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Scheduled tasks (CRON)
    ScheduleModule.forRoot(),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Feature modules
    ParseModule,
    ScrapingModule,
    ClassificationModule,
    NotificationsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
