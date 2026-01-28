import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapingController } from './scraping.controller';
import { ScrapingTask } from './scraping.task';
import { MarchesPublicsParser } from './parsers/marches-publics.parser';

@Module({
  providers: [ScrapingService, ScrapingTask, MarchesPublicsParser],
  controllers: [ScrapingController],
  exports: [ScrapingService],
})
export class ScrapingModule {}
