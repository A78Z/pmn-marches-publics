import { Injectable, Logger } from '@nestjs/common';
import { Page } from 'playwright';

export interface ScrapedTender {
  reference: string;
  titre: string;
  description: string;
  institution: string;
  categorie: string;
  datePublication: Date;
  dateLimite: Date;
  region: string;
  montant?: number;
  urlSource: string;
  urlDossier?: string;
}

/**
 * Parser spécifique pour le site marchespublics.sn
 * 
 * Note: Les sélecteurs CSS ci-dessous sont des exemples basés sur la structure
 * typique des sites de marchés publics. Ils devront être ajustés en fonction
 * de la structure réelle du site www.marchespublics.sn
 * 
 * STRATÉGIE DE RÉSILIENCE:
 * 1. Utiliser plusieurs sélecteurs alternatifs
 * 2. Gérer les erreurs gracieusement
 * 3. Logger les changements de structure détectés
 */
@Injectable()
export class MarchesPublicsParser {
  private readonly logger = new Logger(MarchesPublicsParser.name);

  // Sélecteurs CSS - À ADAPTER selon la structure réelle du site
  private readonly selectors = {
    // Liste des appels d'offres
    tenderList: '.liste-avis, .tender-list, table.datatable tbody tr, .ao-list-item',
    tenderItem: '.avis-item, .tender-item, tr, .ao-item',
    
    // Champs individuels
    reference: '.reference, .numero-avis, td:nth-child(1), .ao-ref',
    titre: '.titre, .objet, td:nth-child(2), .ao-title, h3, h4',
    institution: '.autorite, .institution, .organisme, td:nth-child(3), .ao-org',
    dateLimite: '.date-limite, .deadline, td:nth-child(4), .ao-deadline',
    datePublication: '.date-publication, .published, td:nth-child(5), .ao-pubdate',
    region: '.region, .localisation, .lieu, td:nth-child(6), .ao-location',
    categorie: '.categorie, .type, .nature, .ao-category',
    
    // Liens
    detailLink: 'a.detail, a.voir-plus, a[href*="detail"], a[href*="view"]',
    downloadLink: 'a.download, a[href*=".pdf"], a[href*="document"], .ao-download',
    
    // Pagination
    nextPage: '.pagination a.next, .page-suivante, a[rel="next"], .pagination li:last-child a',
    
    // Page de détail
    detailDescription: '.description, .contenu, .detail-content, .ao-description',
    detailMontant: '.montant, .budget, .estimation, .ao-amount',
  };

  /**
   * Parse la liste des appels d'offres d'une page
   */
  async parseListPage(page: Page): Promise<ScrapedTender[]> {
    const tenders: ScrapedTender[] = [];

    try {
      // Attendre que le contenu soit chargé
      await page.waitForSelector(
        this.selectors.tenderList.split(', ')[0],
        { timeout: 10000 }
      ).catch(() => {
        // Essayer les sélecteurs alternatifs
        this.logger.warn('Sélecteur principal non trouvé, essai des alternatives...');
      });

      // Récupérer tous les éléments de la liste
      const items = await page.$$(this.selectors.tenderItem);
      
      this.logger.debug(`${items.length} éléments trouvés dans la liste`);

      for (let i = 0; i < items.length; i++) {
        try {
          const item = items[i];
          const tender = await this.parseTenderItem(item, page);
          
          if (tender && tender.reference && tender.titre) {
            tenders.push(tender);
          }
        } catch (error: any) {
          this.logger.warn(`Erreur parsing élément ${i}: ${error.message}`);
        }
      }
    } catch (error: any) {
      this.logger.error(`Erreur parsing liste: ${error.message}`);
      
      // Détecter un changement de structure
      await this.detectStructureChange(page);
    }

    return tenders;
  }

  /**
   * Parse un élément individuel d'appel d'offre
   */
  private async parseTenderItem(
    element: any,
    page: Page,
  ): Promise<ScrapedTender | null> {
    try {
      // Extraire les données de base
      const reference = await this.extractText(element, this.selectors.reference);
      const titre = await this.extractText(element, this.selectors.titre);
      const institution = await this.extractText(element, this.selectors.institution);
      const dateLimiteStr = await this.extractText(element, this.selectors.dateLimite);
      const datePublicationStr = await this.extractText(element, this.selectors.datePublication);
      const region = await this.extractText(element, this.selectors.region) || 'National';
      const categorie = await this.extractText(element, this.selectors.categorie) || '';

      // Extraire le lien de détail
      const detailLink = await element.$(this.selectors.detailLink);
      let urlSource = '';
      let description = '';
      let urlDossier = '';
      let montant: number | undefined;

      if (detailLink) {
        urlSource = await detailLink.getAttribute('href') || '';
        
        // Normaliser l'URL
        if (urlSource && !urlSource.startsWith('http')) {
          const baseUrl = page.url();
          const base = new URL(baseUrl);
          urlSource = new URL(urlSource, base.origin).toString();
        }
      }

      // Parser les dates
      const dateLimite = this.parseDate(dateLimiteStr);
      const datePublication = this.parseDate(datePublicationStr) || new Date();

      if (!reference || !titre || !dateLimite) {
        return null;
      }

      // Générer une référence si absente
      const finalReference = reference || `AO-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      return {
        reference: finalReference.trim(),
        titre: titre.trim(),
        description: description || titre,
        institution: institution?.trim() || 'Non spécifié',
        categorie: categorie?.trim() || '',
        datePublication,
        dateLimite,
        region: this.normalizeRegion(region),
        montant,
        urlSource: urlSource || page.url(),
        urlDossier,
      };
    } catch (error: any) {
      this.logger.debug(`Erreur extraction élément: ${error.message}`);
      return null;
    }
  }

  /**
   * Extrait le texte d'un élément avec plusieurs sélecteurs
   */
  private async extractText(
    parent: any,
    selectorString: string,
  ): Promise<string> {
    const selectors = selectorString.split(', ');

    for (const selector of selectors) {
      try {
        const element = await parent.$(selector.trim());
        if (element) {
          const text = await element.textContent();
          if (text?.trim()) {
            return text.trim();
          }
        }
      } catch {
        // Continuer avec le sélecteur suivant
      }
    }

    return '';
  }

  /**
   * Parse une date depuis une chaîne de caractères
   */
  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    // Nettoyer la chaîne
    const cleaned = dateStr.trim().replace(/\s+/g, ' ');

    // Formats courants
    const formats = [
      // JJ/MM/AAAA
      /(\d{2})\/(\d{2})\/(\d{4})/,
      // JJ-MM-AAAA
      /(\d{2})-(\d{2})-(\d{4})/,
      // AAAA-MM-JJ
      /(\d{4})-(\d{2})-(\d{2})/,
      // JJ mois AAAA (français)
      /(\d{1,2})\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/i,
    ];

    const monthNames: Record<string, number> = {
      janvier: 0, février: 1, mars: 2, avril: 3,
      mai: 4, juin: 5, juillet: 6, août: 7,
      septembre: 8, octobre: 9, novembre: 10, décembre: 11,
    };

    for (const format of formats) {
      const match = cleaned.match(format);
      if (match) {
        if (format === formats[0] || format === formats[1]) {
          // JJ/MM/AAAA ou JJ-MM-AAAA
          return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
        } else if (format === formats[2]) {
          // AAAA-MM-JJ
          return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
        } else if (format === formats[3]) {
          // JJ mois AAAA
          const month = monthNames[match[2].toLowerCase()];
          if (month !== undefined) {
            return new Date(parseInt(match[3]), month, parseInt(match[1]));
          }
        }
      }
    }

    // Essayer le parsing natif
    const nativeDate = new Date(cleaned);
    if (!isNaN(nativeDate.getTime())) {
      return nativeDate;
    }

    return null;
  }

  /**
   * Normalise le nom de la région
   */
  private normalizeRegion(region: string): string {
    const regionMap: Record<string, string> = {
      'dakar': 'Dakar',
      'thies': 'Thiès',
      'thiès': 'Thiès',
      'saint-louis': 'Saint-Louis',
      'st-louis': 'Saint-Louis',
      'ziguinchor': 'Ziguinchor',
      'kaolack': 'Kaolack',
      'fatick': 'Fatick',
      'kolda': 'Kolda',
      'tambacounda': 'Tambacounda',
      'louga': 'Louga',
      'matam': 'Matam',
      'diourbel': 'Diourbel',
      'kaffrine': 'Kaffrine',
      'sedhiou': 'Sédhiou',
      'sédhiou': 'Sédhiou',
      'kedougou': 'Kédougou',
      'kédougou': 'Kédougou',
      'national': 'National',
      'tout le sénégal': 'National',
    };

    const normalized = region.toLowerCase().trim();
    return regionMap[normalized] || region || 'National';
  }

  /**
   * Vérifie s'il y a une page suivante
   */
  async hasNextPage(page: Page): Promise<boolean> {
    try {
      const nextButton = await page.$(this.selectors.nextPage);
      if (!nextButton) return false;

      // Vérifier si le bouton est désactivé
      const isDisabled = await nextButton.getAttribute('disabled');
      const classList = await nextButton.getAttribute('class') || '';
      
      return !isDisabled && !classList.includes('disabled');
    } catch {
      return false;
    }
  }

  /**
   * Navigue vers la page suivante
   */
  async goToNextPage(page: Page): Promise<void> {
    const nextButton = await page.$(this.selectors.nextPage);
    if (nextButton) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');
    }
  }

  /**
   * Détecte les changements de structure du site
   */
  private async detectStructureChange(page: Page): Promise<void> {
    const bodyHtml = await page.content();
    
    // Vérifier la présence d'éléments clés
    const keyElements = [
      'table', '.liste', '.list', 'tbody', '.avis', '.tender', '.ao-'
    ];

    const foundElements: string[] = [];
    for (const element of keyElements) {
      if (bodyHtml.includes(element)) {
        foundElements.push(element);
      }
    }

    this.logger.warn(
      `⚠️ Changement de structure détecté. Éléments trouvés: ${foundElements.join(', ')}`,
    );
    this.logger.warn(
      'Les sélecteurs CSS doivent peut-être être mis à jour dans marches-publics.parser.ts',
    );
  }
}
