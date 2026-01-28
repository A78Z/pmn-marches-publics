import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { ScrapingService } from './scraping.service';

@Injectable()
export class ScrapingTask {
  private readonly logger = new Logger(ScrapingTask.name);

  constructor(
    private scrapingService: ScrapingService,
    private configService: ConfigService,
  ) {}

  /**
   * Tâche CRON pour le scraping automatique
   * Par défaut: 6h, 12h, 18h chaque jour
   */
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async handleScrapingAt6AM() {
    await this.runScheduledScraping('6:00');
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async handleScrapingAtNoon() {
    await this.runScheduledScraping('12:00');
  }

  @Cron('0 18 * * *') // 18h chaque jour
  async handleScrapingAt6PM() {
    await this.runScheduledScraping('18:00');
  }

  /**
   * Exécute le scraping planifié
   */
  private async runScheduledScraping(time: string): Promise<void> {
    this.logger.log(`⏰ Démarrage du scraping planifié (${time})`);

    try {
      const result = await this.scrapingService.scrape();

      this.logger.log(
        `✅ Scraping planifié terminé - Nouveaux: ${result.stats.newTenders}, ` +
        `Mis à jour: ${result.stats.updatedTenders}, Durée: ${result.duration}ms`,
      );

      // TODO: Envoyer des notifications si de nouveaux appels d'offres sont trouvés
      if (result.stats.newTenders > 0) {
        this.logger.log(
          `📬 ${result.stats.newTenders} nouveaux appels d'offres à notifier`,
        );
        // this.notificationService.notifyNewTenders(result.stats.newTenders);
      }
    } catch (error: any) {
      this.logger.error(`❌ Erreur scraping planifié: ${error.message}`);
    }
  }
}
