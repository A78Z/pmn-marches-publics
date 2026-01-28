import { Injectable, Logger } from '@nestjs/common';
import { ParseService } from '../parse.service';
import * as CryptoJS from 'crypto-js';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Parse = require('parse/node');

/**
 * Type pour tous les modules PMN
 */
export type ModulePMN = 
  | 'entretiens' 
  | 'tenues' 
  | 'achats'
  | 'vehicules'
  | 'chaussures_maroquinerie'
  | 'equipements_militaires'
  | 'mobilier_hospitalier'
  | 'textiles_professionnels'
  | 'btp'
  | 'fabrication_metallique'
  | 'maintenance_industrielle'
  | 'equipements_agricoles';

/**
 * Liste de tous les modules pour itération
 */
export const ALL_MODULES: ModulePMN[] = [
  'entretiens',
  'tenues',
  'achats',
  'vehicules',
  'chaussures_maroquinerie',
  'equipements_militaires',
  'mobilier_hospitalier',
  'textiles_professionnels',
  'btp',
  'fabrication_metallique',
  'maintenance_industrielle',
  'equipements_agricoles',
];

export interface AppelOffreData {
  reference: string;
  titre: string;
  description: string;
  institution: string;
  categorie: string;
  module: ModulePMN;
  motsCles: string[];
  datePublication: Date;
  dateLimite: Date;
  region: string;
  montant?: number;
  devise?: string;
  urlSource: string;
  urlDossier?: string;
  statut?: 'actif' | 'expire' | 'attribue' | 'annule';
}

@Injectable()
export class AppelOffreRepository {
  private readonly logger = new Logger(AppelOffreRepository.name);
  private readonly className = 'AppelOffre';

  constructor(private parseService: ParseService) {}

  /**
   * Génère un hash unique pour détecter les modifications
   */
  private generateHash(data: AppelOffreData): string {
    const content = `${data.titre}|${data.description}|${data.dateLimite}|${data.montant}`;
    return CryptoJS.SHA256(content).toString();
  }

  /**
   * Crée ou met à jour un appel d'offre
   */
  async upsert(data: AppelOffreData): Promise<{ isNew: boolean; objectId: string }> {
    const hash = this.generateHash(data);

    // Chercher si l'appel d'offre existe déjà (par référence)
    const query = this.parseService.createQuery(this.className);
    query.equalTo('reference', data.reference);

    const existing = await this.parseService.firstWithMasterKey(query);

    if (existing) {
      // Vérifier si le contenu a changé
      const existingHash = existing.get('sourceHash');
      
      if (existingHash === hash) {
        // Pas de changement
        return { isNew: false, objectId: existing.id };
      }

      // Mettre à jour
      existing.set('titre', data.titre);
      existing.set('description', data.description);
      existing.set('institution', data.institution);
      existing.set('categorie', data.categorie);
      existing.set('module', data.module);
      existing.set('motsCles', data.motsCles);
      existing.set('datePublication', data.datePublication);
      existing.set('dateLimite', data.dateLimite);
      existing.set('region', data.region);
      existing.set('montant', data.montant);
      existing.set('devise', data.devise || 'XOF');
      existing.set('urlSource', data.urlSource);
      existing.set('urlDossier', data.urlDossier);
      existing.set('sourceHash', hash);
      existing.set('derniereSynchronisation', new Date());

      await this.parseService.saveWithMasterKey(existing);
      this.logger.log(`Appel d'offre mis à jour: ${data.reference}`);
      
      return { isNew: false, objectId: existing.id };
    }

    // Créer un nouvel appel d'offre
    const appelOffre = this.parseService.createObject(this.className);
    
    appelOffre.set('reference', data.reference);
    appelOffre.set('titre', data.titre);
    appelOffre.set('description', data.description);
    appelOffre.set('institution', data.institution);
    appelOffre.set('categorie', data.categorie);
    appelOffre.set('module', data.module);
    appelOffre.set('motsCles', data.motsCles);
    appelOffre.set('datePublication', data.datePublication);
    appelOffre.set('dateLimite', data.dateLimite);
    appelOffre.set('region', data.region);
    appelOffre.set('montant', data.montant);
    appelOffre.set('devise', data.devise || 'XOF');
    appelOffre.set('urlSource', data.urlSource);
    appelOffre.set('urlDossier', data.urlDossier);
    appelOffre.set('statut', data.statut || 'actif');
    appelOffre.set('sourceHash', hash);
    appelOffre.set('derniereSynchronisation', new Date());

    // ACL: lecture publique, écriture admin uniquement
    this.parseService.setPublicReadACL(appelOffre);

    await this.parseService.saveWithMasterKey(appelOffre);
    this.logger.log(`Nouvel appel d'offre créé: ${data.reference}`);

    return { isNew: true, objectId: appelOffre.id };
  }

  /**
   * Met à jour le statut des appels d'offres expirés
   */
  async updateExpiredStatus(): Promise<number> {
    const query = this.parseService.createQuery(this.className);
    query.equalTo('statut', 'actif');
    query.lessThan('dateLimite', new Date());

    const expired = await this.parseService.findWithMasterKey(query);

    for (const appelOffre of expired) {
      appelOffre.set('statut', 'expire');
      await this.parseService.saveWithMasterKey(appelOffre);
    }

    if (expired.length > 0) {
      this.logger.log(`${expired.length} appel(s) d'offre marqué(s) comme expiré(s)`);
    }

    return expired.length;
  }

  /**
   * Récupère tous les appels d'offres actifs
   */
  async findActive(options?: {
    module?: string;
    region?: string;
    limit?: number;
    skip?: number;
  }): Promise<Parse.Object[]> {
    const query = this.parseService.createQuery(this.className);
    query.equalTo('statut', 'actif');
    query.ascending('dateLimite');

    if (options?.module) {
      query.equalTo('module', options.module);
    }

    if (options?.region) {
      query.equalTo('region', options.region);
    }

    if (options?.limit) {
      query.limit(options.limit);
    }

    if (options?.skip) {
      query.skip(options.skip);
    }

    return this.parseService.findWithMasterKey(query);
  }

  /**
   * Récupère un appel d'offre par son ID
   */
  async findById(objectId: string): Promise<Parse.Object | null> {
    return this.parseService.getByIdWithMasterKey(this.className, objectId);
  }

  /**
   * Récupère un appel d'offre par sa référence
   */
  async findByReference(reference: string): Promise<Parse.Object | undefined> {
    const query = this.parseService.createQuery(this.className);
    query.equalTo('reference', reference);
    return this.parseService.firstWithMasterKey(query);
  }

  /**
   * Compte les appels d'offres par module
   */
  async countByModule(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};

    for (const module of ALL_MODULES) {
      const query = this.parseService.createQuery(this.className);
      query.equalTo('module', module);
      query.equalTo('statut', 'actif');
      counts[module] = await this.parseService.countWithMasterKey(query);
    }

    return counts;
  }

  /**
   * Recherche textuelle dans les appels d'offres
   */
  async search(
    searchTerm: string,
    options?: { module?: string; region?: string; limit?: number },
  ): Promise<Parse.Object[]> {
    // Parse ne supporte pas la recherche full-text nativement
    // On utilise une recherche basique avec containsAll sur les mots-clés
    const query = this.parseService.createQuery(this.className);
    query.equalTo('statut', 'actif');

    // Recherche dans les mots-clés
    const terms = searchTerm.toLowerCase().split(' ').filter(Boolean);
    if (terms.length > 0) {
      query.containsAll('motsCles', terms);
    }

    if (options?.module) {
      query.equalTo('module', options.module);
    }

    if (options?.region) {
      query.equalTo('region', options.region);
    }

    query.limit(options?.limit || 20);
    query.ascending('dateLimite');

    return this.parseService.findWithMasterKey(query);
  }

  /**
   * Récupère les derniers appels d'offres ajoutés
   */
  async findRecent(limit: number = 10): Promise<Parse.Object[]> {
    const query = this.parseService.createQuery(this.className);
    query.equalTo('statut', 'actif');
    query.descending('createdAt');
    query.limit(limit);

    return this.parseService.findWithMasterKey(query);
  }

  /**
   * Récupère les appels d'offres urgents (date limite proche)
   */
  async findUrgent(daysThreshold: number = 7): Promise<Parse.Object[]> {
    const query = this.parseService.createQuery(this.className);
    query.equalTo('statut', 'actif');
    
    const now = new Date();
    const threshold = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);
    
    query.greaterThan('dateLimite', now);
    query.lessThanOrEqualTo('dateLimite', threshold);
    query.ascending('dateLimite');

    return this.parseService.findWithMasterKey(query);
  }
}
