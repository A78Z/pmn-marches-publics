import {
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ScrapingService, ScrapingResult } from './scraping.service';

@ApiTags('scraping')
@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post('trigger')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Déclenche un scraping manuel' })
  @ApiResponse({
    status: 200,
    description: 'Scraping terminé avec succès',
  })
  @ApiResponse({
    status: 409,
    description: 'Un scraping est déjà en cours',
  })
  async triggerScraping(): Promise<ScrapingResult> {
    return this.scrapingService.scrape();
  }

  @Get('status')
  @ApiOperation({ summary: 'Vérifie si un scraping est en cours' })
  @ApiResponse({
    status: 200,
    description: 'Statut du scraping',
  })
  getStatus(): { isRunning: boolean } {
    return {
      isRunning: this.scrapingService.isScrapingInProgress(),
    };
  }

  @Post('stop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Arrête le scraping en cours' })
  @ApiResponse({
    status: 200,
    description: 'Scraping arrêté',
  })
  async stopScraping(): Promise<{ message: string }> {
    await this.scrapingService.stopScraping();
    return { message: 'Scraping arrêté' };
  }
}
