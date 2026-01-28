import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

class TestNotificationDto {
  email?: string;
  whatsapp?: string;
}

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Envoie une notification de test' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@example.com' },
        whatsapp: { type: 'string', example: '+221770001122' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Notification de test envoyée',
  })
  async sendTestNotification(
    @Body() dto: TestNotificationDto,
  ): Promise<{ message: string }> {
    const testTenders = [
      {
        tenderId: 'test-001',
        reference: 'AO-TEST-2026-001',
        titre: 'Marché de test - Nettoyage des locaux administratifs',
        module: 'entretiens',
        institution: 'Ministère Test',
        dateLimite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        region: 'Dakar',
      },
    ];

    await this.notificationsService.notifyNewTenders(testTenders);

    return { message: 'Notification de test envoyée' };
  }
}
