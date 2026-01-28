import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { chromium, Browser, Page } from 'playwright';
import { MarchesPublicsParser, ScrapedTender } from './parsers/marches-publics.parser';
import { AppelOffreRepository } from '../parse/repositories/appel-offre.repository';
import { ClassificationService } from '../classification/classification.service';

export interface ScrapingResult {
  success: boolean;
  sessionId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  stats: {
    pagesScraped: number;
    newTenders: number;
    updatedTenders: number;
    errors: number;
  };
  errors: Array<{ message: string; page?: string }>;
}

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);
  private browser: Browser | null = null;
  private isRunning = false;

  constructor(
    private configService: ConfigService,
    private parser: MarchesPublicsParser,
    private appelOffreRepository: AppelOffreRepository,
    private classificationService: ClassificationService,
  ) {}

  /**
   * Lance le processus complet de scraping
   */
  async scrape(): Promise<ScrapingResult> {
    if (this.isRunning) {
      throw new Error('Un scraping est déjà en cours');
    }

    this.isRunning = true;
    const sessionId = `scrape-${Date.now()}`;
    const startTime = new Date();
    const errors: Array<{ message: string; page?: string }> = [];
    let pagesScraped = 0;
    let newTenders = 0;
    let updatedTenders = 0;

    this.logger.log(`🚀 Démarrage du scraping - Session: ${sessionId}`);

    try {
      // Lancer le navigateur
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
        ],
      });

      const context = await this.browser.newContext({
        userAgent: this.configService.get<string>('scraping.userAgent'),
        viewport: { width: 1920, height: 1080 },
        locale: 'fr-FR',
      });

      const page = await context.newPage();
      const timeout = this.configService.get<number>('scraping.timeout') || 30000;
      page.setDefaultTimeout(timeout);

      const sourceUrl = this.configService.get<string>('scraping.sourceUrl');

      if (!sourceUrl) {
        throw new Error('Source URL not configured');
      }

      // Scraper la page principale des appels d'offres
      this.logger.log(`📄 Navigation vers: ${sourceUrl}`);
      
      try {
        await page.goto(sourceUrl, { waitUntil: 'networkidle' });
        pagesScraped++;

        // Parser les appels d'offres de la page
        const tenders = await this.parser.parseListPage(page);
        this.logger.log(`📋 ${tenders.length} appels d'offres trouvés sur la page`);

        // Traiter chaque appel d'offre
        for (const tender of tenders) {
          try {
            const result = await this.processTender(tender, page);
            if (result.isNew) {
              newTenders++;
            } else {
              updatedTenders++;
            }
          } catch (error: any) {
            this.logger.error(`Erreur traitement: ${tender.reference} - ${error.message}`);
            errors.push({ message: error.message, page: tender.urlSource });
          }
        }

        // Scraper les pages suivantes (pagination)
        let hasNextPage = await this.parser.hasNextPage(page);
        let pageNumber = 2;
        const maxPages = 10; // Limite de sécurité

        while (hasNextPage && pageNumber <= maxPages) {
          try {
            this.logger.log(`📄 Navigation vers page ${pageNumber}`);
            await this.parser.goToNextPage(page);
            await page.waitForLoadState('networkidle');
            pagesScraped++;

            const moreTenders = await this.parser.parseListPage(page);
            this.logger.log(`📋 ${moreTenders.length} appels d'offres trouvés sur la page ${pageNumber}`);

            for (const tender of moreTenders) {
              try {
                const result = await this.processTender(tender, page);
                if (result.isNew) {
                  newTenders++;
                } else {
                  updatedTenders++;
                }
              } catch (error: any) {
                errors.push({ message: error.message, page: tender.urlSource });
              }
            }

            hasNextPage = await this.parser.hasNextPage(page);
            pageNumber++;
          } catch (error: any) {
            this.logger.warn(`Erreur pagination page ${pageNumber}: ${error.message}`);
            break;
          }
        }

      } catch (error: any) {
        this.logger.error(`Erreur lors du scraping: ${error.message}`);
        errors.push({ message: error.message, page: sourceUrl });
      }

      // Mettre à jour le statut des appels d'offres expirés
      await this.appelOffreRepository.updateExpiredStatus();

      await context.close();
    } catch (error: any) {
      this.logger.error(`Erreur critique: ${error.message}`);
      errors.push({ message: `Erreur critique: ${error.message}` });
    } finally {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      this.isRunning = false;
    }

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    const result: ScrapingResult = {
      success: errors.length === 0,
      sessionId,
      startTime,
      endTime,
      duration,
      stats: {
        pagesScraped,
        newTenders,
        updatedTenders,
        errors: errors.length,
      },
      errors,
    };

    this.logger.log(
      `✅ Scraping terminé - Nouvaux: ${newTenders}, Mis à jour: ${updatedTenders}, Erreurs: ${errors.length}, Durée: ${duration}ms`,
    );

    return result;
  }

  /**
   * Traite un appel d'offre scrapé
   */
  private async processTender(
    tender: ScrapedTender,
    page: Page,
  ): Promise<{ isNew: boolean; objectId: string }> {
    // Classifier l'appel d'offre
    const classification = this.classificationService.classify(
      tender.titre,
      tender.description,
      tender.categorie,
    );

    // Sauvegarder dans Parse
    return this.appelOffreRepository.upsert({
      reference: tender.reference,
      titre: tender.titre,
      description: tender.description,
      institution: tender.institution,
      categorie: tender.categorie,
      module: classification.module,
      motsCles: classification.keywords,
      datePublication: tender.datePublication,
      dateLimite: tender.dateLimite,
      region: tender.region,
      montant: tender.montant,
      urlSource: tender.urlSource,
      urlDossier: tender.urlDossier,
    });
  }

  /**
   * Vérifie si un scraping est en cours
   */
  isScrapingInProgress(): boolean {
    return this.isRunning;
  }

  /**
   * Arrête le scraping en cours
   */
  async stopScraping(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    this.isRunning = false;
    this.logger.log('Scraping arrêté');
  }
}
