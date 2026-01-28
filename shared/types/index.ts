/**
 * Types partagés entre le frontend et le backend
 * PMN Marchés Publics
 */

// Modules métiers PMN
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

// Statuts possibles d'un appel d'offre
export type StatutAppelOffre = 'actif' | 'expire' | 'attribue' | 'annule';

// Régions du Sénégal
export type Region =
  | 'Dakar'
  | 'Diourbel'
  | 'Fatick'
  | 'Kaffrine'
  | 'Kaolack'
  | 'Kédougou'
  | 'Kolda'
  | 'Louga'
  | 'Matam'
  | 'Saint-Louis'
  | 'Sédhiou'
  | 'Tambacounda'
  | 'Thiès'
  | 'Ziguinchor'
  | 'National';

// Rôles utilisateur
export type RoleUtilisateur = 'artisan' | 'admin';

/**
 * Appel d'offre
 */
export interface AppelOffre {
  objectId: string;
  reference: string;
  titre: string;
  description: string;
  institution: string;
  categorie: string;
  module: ModulePMN;
  motsCles: string[];
  datePublication: Date | string;
  dateLimite: Date | string;
  region: Region;
  montant?: number;
  devise: string;
  urlSource: string;
  urlDossier?: string;
  statut: StatutAppelOffre;
  sourceHash?: string;
  derniereSynchronisation?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Document associé à un appel d'offre
 */
export interface Document {
  objectId: string;
  appelOffre: AppelOffre;
  nom: string;
  type: 'dao' | 'cahier_charges' | 'annexe' | 'autre';
  fichierUrl?: string;
  urlExterne?: string;
  taille?: number;
  format: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Artisan (utilisateur)
 */
export interface Artisan {
  objectId: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  whatsapp?: string;
  metier: string;
  specialites: string[];
  entreprise?: string;
  ninea?: string;
  region: Region;
  adresse?: string;
  alertesEmail: boolean;
  alertesWhatsapp: boolean;
  modulesAlertes: ModulePMN[];
  regionsAlertes: Region[];
  role: RoleUtilisateur;
  estVerifie: boolean;
  dateInscription?: Date | string;
  derniereConnexion?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Favori
 */
export interface Favori {
  objectId: string;
  artisan: Artisan;
  appelOffre: AppelOffre;
  notes?: string;
  rappel?: Date | string;
  createdAt: Date | string;
}

/**
 * Historique de consultation
 */
export interface Historique {
  objectId: string;
  artisan: Artisan;
  appelOffre: AppelOffre;
  dateConsultation: Date | string;
  dureeConsultation?: number;
  action: 'vue' | 'telechargement' | 'partage';
}

/**
 * Alerte personnalisée
 */
export interface Alerte {
  objectId: string;
  artisan: Artisan;
  nom: string;
  actif: boolean;
  modules: ModulePMN[];
  regions: Region[];
  motsCles: string[];
  montantMin?: number;
  montantMax?: number;
  email: boolean;
  whatsapp: boolean;
  push: boolean;
  frequence: 'instantanee' | 'quotidienne' | 'hebdomadaire';
  heureEnvoi?: string;
  nombreEnvois: number;
  dernierEnvoi?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Log de scraping
 */
export interface ScrapingLog {
  objectId: string;
  sessionId: string;
  statut: 'succes' | 'partiel' | 'echec';
  dateDebut: Date | string;
  dateFin: Date | string;
  dureeMs: number;
  pagesScrapees: number;
  nouveauxAppels: number;
  appelsModifies: number;
  erreurs: number;
  logs: Array<{
    timestamp: Date | string;
    niveau: 'info' | 'warn' | 'error';
    message: string;
    donnees?: Record<string, unknown>;
  }>;
  changementsStructure?: Array<{
    selecteur: string;
    description: string;
  }>;
  createdAt: Date | string;
}

/**
 * Configuration système
 */
export interface Configuration {
  objectId: string;
  cle: string;
  valeur: unknown;
  type: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Filtres pour la recherche d'appels d'offres
 */
export interface AppelOffreFilters {
  module?: ModulePMN | ModulePMN[];
  region?: Region;
  statut?: StatutAppelOffre;
  search?: string;
  institution?: string;
  dateDebut?: Date | string;
  dateFin?: Date | string;
  montantMin?: number;
  montantMax?: number;
  page?: number;
  limit?: number;
  sortBy?: 'dateLimite' | 'datePublication' | 'montant';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Résultat de recherche paginée
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Résultat de classification
 */
export interface ClassificationResult {
  module: ModulePMN;
  confidence: number;
  keywords: string[];
  matchedRules: string[];
}

/**
 * Statistiques des appels d'offres
 */
export interface AppelOffreStats {
  total: number;
  parModule: Record<ModulePMN, number>;
  parRegion: Record<Region, number>;
  parStatut: Record<StatutAppelOffre, number>;
  nouveauxCetteSession?: number;
}

/**
 * Informations sur les modules PMN
 */
export const MODULES_PMN_INFO: Record<
  ModulePMN,
  {
    nom: string;
    description: string;
    icone: string;
    couleur: string;
  }
> = {
  entretiens: {
    nom: 'Entretiens',
    description: 'Nettoyage, maintenance, gardiennage',
    icone: '🧹',
    couleur: '#10B981',
  },
  tenues: {
    nom: 'Tenues',
    description: 'Uniformes, habillement, textile, couture',
    icone: '👔',
    couleur: '#6366F1',
  },
  achats: {
    nom: 'Achats',
    description: 'Mobilier, équipements, fournitures',
    icone: '🪑',
    couleur: '#F59E0B',
  },
  vehicules: {
    nom: 'Véhicules et Maintenance Automobile',
    description: 'Véhicules, pièces détachées, entretien automobile',
    icone: '🚗',
    couleur: '#3B82F6',
  },
  chaussures_maroquinerie: {
    nom: 'Chaussures, Maroquinerie et Articles en cuir',
    description: 'Chaussures, sacs, ceintures, articles en cuir',
    icone: '👞',
    couleur: '#8B5CF6',
  },
  equipements_militaires: {
    nom: 'Équipements militaires et de sécurité',
    description: 'Équipements défense, sécurité, protection',
    icone: '🛡️',
    couleur: '#64748B',
  },
  mobilier_hospitalier: {
    nom: 'Mobilier et Équipements Hospitaliers',
    description: 'Mobilier médical, équipements de santé',
    icone: '🏥',
    couleur: '#EC4899',
  },
  textiles_professionnels: {
    nom: 'Textiles professionnels et vêtements de travail',
    description: 'Vêtements de travail, EPI textiles, linge professionnel',
    icone: '🦺',
    couleur: '#F97316',
  },
  btp: {
    nom: 'Bâtiment et Travaux Publics',
    description: 'Construction, génie civil, travaux publics',
    icone: '🏗️',
    couleur: '#EAB308',
  },
  fabrication_metallique: {
    nom: 'Fabrication métallique et structures',
    description: 'Métallurgie, charpentes, structures métalliques',
    icone: '🔩',
    couleur: '#78716C',
  },
  maintenance_industrielle: {
    nom: 'Maintenance industrielle et technique',
    description: 'Maintenance machines, équipements industriels',
    icone: '⚙️',
    couleur: '#0EA5E9',
  },
  equipements_agricoles: {
    nom: 'Équipements agricoles et agro-industriels',
    description: 'Machines agricoles, équipements agro-industrie',
    icone: '🚜',
    couleur: '#22C55E',
  },
};

/**
 * Liste des régions du Sénégal
 */
export const REGIONS_SENEGAL: Region[] = [
  'Dakar',
  'Diourbel',
  'Fatick',
  'Kaffrine',
  'Kaolack',
  'Kédougou',
  'Kolda',
  'Louga',
  'Matam',
  'Saint-Louis',
  'Sédhiou',
  'Tambacounda',
  'Thiès',
  'Ziguinchor',
  'National',
];
