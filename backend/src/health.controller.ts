import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Vérification de santé de l\'API' })
  @ApiResponse({ status: 200, description: 'L\'API fonctionne correctement' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'PMN Marchés Publics API',
      version: '1.0.0',
    };
  }
}
