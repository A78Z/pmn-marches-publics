/**
 * Données mock pour les appels d'offres
 * Sera remplacé par les données Parse en production
 */

import { MODULES_PMN } from '@/lib/utils';

export interface MockTender {
  id: string;
  reference: string;
  titre: string;
  description: string;
  institution: string;
  module: keyof typeof MODULES_PMN;
  categorie: string;
  motsCles: string[];
  region: string;
  datePublication: string;
  dateLimite: string;
  montant?: number;
  devise: string;
  urlSource: string;
  daoFile?: string; // URL du fichier hébergé sur PMN/Back4App
  daoSourceUrl?: string; // URL du DAO sur le site source
  statut: 'actif' | 'expire' | 'attribue' | 'annule';
}

export const mockTenders: MockTender[] = [
  // === ENTRETIENS ===
  {
    id: '1',
    reference: 'AO-2026-001234',
    titre: 'Marché de nettoyage et d\'entretien des locaux administratifs du Ministère de l\'Éducation',
    description: `Le Ministère de l'Éducation Nationale du Sénégal lance un appel d'offres pour la sélection d'une entreprise spécialisée dans les services de nettoyage et d'entretien des locaux administratifs.

Les prestations attendues comprennent :
- Le nettoyage quotidien des bureaux, couloirs et sanitaires
- L'entretien des espaces communs et salles de réunion
- Le nettoyage des vitres et façades (mensuel)
- La désinfection régulière des zones à forte fréquentation
- La gestion des déchets et leur évacuation

Le marché est prévu pour une durée de 2 ans, renouvelable une fois.

Les candidats doivent justifier d'une expérience minimale de 3 ans dans des prestations similaires et disposer des certifications requises en matière d'hygiène et de sécurité.

Le dossier de candidature doit comprendre :
1. Une lettre de soumission
2. Les statuts de l'entreprise
3. Les références des 3 dernières années
4. Les attestations fiscales et sociales à jour
5. Un certificat de capacité financière`,
    institution: 'Ministère de l\'Éducation Nationale',
    module: 'entretiens',
    categorie: 'Services de nettoyage',
    motsCles: ['nettoyage', 'entretien', 'hygiène', 'locaux administratifs', 'désinfection'],
    region: 'Dakar',
    datePublication: '2026-01-25',
    dateLimite: '2026-02-15',
    montant: 45000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1234',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1234.pdf',
    statut: 'actif',
  },
  {
    id: '4',
    reference: 'AO-2026-001237',
    titre: 'Services de gardiennage et surveillance des bâtiments administratifs',
    description: `Le Ministère de la Santé lance un appel d'offres pour la prestation de services de sécurité et gardiennage 24h/24 de ses bâtiments administratifs dans la région de Thiès.

Les prestations comprennent :
- Surveillance permanente des accès
- Rondes de sécurité
- Gestion des entrées et sorties
- Intervention en cas d'incident

Le prestataire doit disposer d'agents qualifiés et formés aux techniques de sécurité.`,
    institution: 'Ministère de la Santé',
    module: 'entretiens',
    categorie: 'Services de sécurité',
    motsCles: ['gardiennage', 'surveillance', 'sécurité', 'vigile', 'rondes'],
    region: 'Thiès',
    datePublication: '2026-01-22',
    dateLimite: '2026-02-05',
    montant: 36000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1237',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1237.pdf',
    statut: 'actif',
  },
  // === TENUES ===
  {
    id: '2',
    reference: 'AO-2026-001235',
    titre: 'Fourniture de tenues de travail et uniformes pour le personnel technique',
    description: `La Direction Générale des Impôts recherche un fournisseur pour l'acquisition de tenues professionnelles pour le personnel de terrain.

Le lot comprend :
- Chemises et pantalons de travail
- Vestes et blousons
- Chaussures de sécurité
- Accessoires (casquettes, ceintures)

Les tenues doivent être conformes aux normes de qualité et personnalisées avec le logo de l'institution.`,
    institution: 'Direction Générale des Impôts',
    module: 'tenues',
    categorie: 'Habillement professionnel',
    motsCles: ['uniforme', 'tenue', 'habillement', 'vêtement de travail', 'textile'],
    region: 'National',
    datePublication: '2026-01-24',
    dateLimite: '2026-02-10',
    montant: 28000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1235',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1235.pdf',
    statut: 'actif',
  },
  {
    id: '5',
    reference: 'AO-2026-001238',
    titre: 'Confection d\'uniformes scolaires pour les établissements publics',
    description: `L'Inspection d'Académie de Saint-Louis lance un appel d'offres pour la fourniture d'uniformes scolaires pour les élèves des écoles publiques de la région.

Le marché comprend :
- Tabliers pour le primaire
- Uniformes complets (garçons et filles) pour le secondaire
- Tenues de sport

Les uniformes doivent respecter les couleurs et modèles officiels définis par le ministère.`,
    institution: 'Inspection d\'Académie de Saint-Louis',
    module: 'tenues',
    categorie: 'Uniformes scolaires',
    motsCles: ['uniforme scolaire', 'tablier', 'confection', 'couture', 'textile'],
    region: 'Saint-Louis',
    datePublication: '2026-01-21',
    dateLimite: '2026-02-28',
    montant: 52000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1238',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1238.pdf',
    statut: 'actif',
  },
  // === ACHATS ===
  {
    id: '3',
    reference: 'AO-2026-001236',
    titre: 'Acquisition de mobilier de bureau et équipements informatiques',
    description: `L'Université Cheikh Anta Diop lance un appel d'offres pour la fourniture et l'installation de mobilier de bureau ergonomique et d'équipements informatiques pour ses nouveaux locaux.

Lot 1 - Mobilier :
- Bureaux ergonomiques
- Chaises de bureau
- Armoires de rangement
- Tables de réunion

Lot 2 - Informatique :
- Ordinateurs de bureau
- Ordinateurs portables
- Imprimantes multifonctions`,
    institution: 'Université Cheikh Anta Diop',
    module: 'achats',
    categorie: 'Mobilier et informatique',
    motsCles: ['mobilier', 'bureau', 'informatique', 'ordinateur', 'équipement'],
    region: 'Dakar',
    datePublication: '2026-01-23',
    dateLimite: '2026-02-20',
    montant: 75000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1236',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1236.pdf',
    statut: 'actif',
  },
  {
    id: '6',
    reference: 'AO-2026-001239',
    titre: 'Fourniture de mobilier pour les nouvelles salles de classe',
    description: `Le Ministère de l'Éducation Nationale recherche des fournisseurs pour l'acquisition de tables-bancs, bureaux et armoires pour équiper les nouvelles salles de classe sur l'ensemble du territoire national.

Spécifications :
- Tables-bancs deux places conformes aux normes
- Bureaux enseignants
- Tableaux muraux
- Armoires de rangement`,
    institution: 'Ministère de l\'Éducation Nationale',
    module: 'achats',
    categorie: 'Mobilier scolaire',
    motsCles: ['mobilier', 'table-banc', 'bureau', 'école', 'équipement scolaire'],
    region: 'National',
    datePublication: '2026-01-20',
    dateLimite: '2026-03-01',
    montant: 120000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1239',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1239.pdf',
    statut: 'actif',
  },
  // === VÉHICULES ET MAINTENANCE AUTOMOBILE ===
  {
    id: '7',
    reference: 'AO-2026-001240',
    titre: 'Acquisition de véhicules de service pour la Direction Générale des Douanes',
    description: `La Direction Générale des Douanes lance un appel d'offres pour la fourniture de 15 véhicules pick-up 4x4 pour les services douaniers aux frontières.

Caractéristiques requises :
- Motorisation diesel
- Transmission 4x4
- Climatisation
- Équipements de sécurité complets

Garantie minimale de 3 ans exigée.`,
    institution: 'Direction Générale des Douanes',
    module: 'vehicules',
    categorie: 'Véhicules de service',
    motsCles: ['véhicule', '4x4', 'pick-up', 'automobile', 'acquisition'],
    region: 'National',
    datePublication: '2026-01-26',
    dateLimite: '2026-02-25',
    montant: 450000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1240',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1240.pdf',
    statut: 'actif',
  },
  {
    id: '8',
    reference: 'AO-2026-001241',
    titre: 'Entretien et maintenance du parc automobile du Ministère des Finances',
    description: `Le Ministère des Finances et du Budget recherche un prestataire pour la maintenance préventive et curative de son parc automobile.

Prestations attendues :
- Vidanges et révisions périodiques
- Réparations mécaniques
- Contrôles techniques
- Pneumatiques
- Carrosserie

Parc de 85 véhicules à entretenir.`,
    institution: 'Ministère des Finances et du Budget',
    module: 'vehicules',
    categorie: 'Maintenance automobile',
    motsCles: ['maintenance', 'entretien', 'véhicule', 'garage', 'mécanique'],
    region: 'Dakar',
    datePublication: '2026-01-24',
    dateLimite: '2026-02-18',
    montant: 85000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1241',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1241.pdf',
    statut: 'actif',
  },
  // === CHAUSSURES, MAROQUINERIE ET ARTICLES EN CUIR ===
  {
    id: '9',
    reference: 'AO-2026-001242',
    titre: 'Fourniture de chaussures de sécurité pour agents de terrain',
    description: `SENELEC lance un appel d'offres pour l'acquisition de 500 paires de chaussures de sécurité conformes aux normes pour les agents techniques.

Spécifications :
- Coque de protection
- Semelle anti-perforation
- Résistance aux hydrocarbures
- Norme ISO 20345

Plusieurs tailles requises selon les effectifs.`,
    institution: 'SENELEC',
    module: 'chaussures_maroquinerie',
    categorie: 'Chaussures de sécurité',
    motsCles: ['chaussures', 'sécurité', 'cuir', 'protection', 'EPI'],
    region: 'National',
    datePublication: '2026-01-25',
    dateLimite: '2026-02-22',
    montant: 35000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1242',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1242.pdf',
    statut: 'actif',
  },
  {
    id: '10',
    reference: 'AO-2026-001243',
    titre: 'Confection de sacs et porte-documents en cuir pour délégations officielles',
    description: `Le Ministère des Affaires Étrangères recherche un artisan ou fournisseur pour la fabrication de maroquinerie de qualité pour les missions diplomatiques.

Articles demandés :
- Porte-documents en cuir véritable
- Sacs de voyage
- Portefeuilles
- Étuis à passeport

Finition haut de gamme avec personnalisation aux armoiries nationales.`,
    institution: 'Ministère des Affaires Étrangères',
    module: 'chaussures_maroquinerie',
    categorie: 'Maroquinerie',
    motsCles: ['maroquinerie', 'cuir', 'sac', 'porte-documents', 'artisanat'],
    region: 'Dakar',
    datePublication: '2026-01-23',
    dateLimite: '2026-02-15',
    montant: 18000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1243',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1243.pdf',
    statut: 'actif',
  },
  // === ÉQUIPEMENTS MILITAIRES ET DE SÉCURITÉ ===
  {
    id: '11',
    reference: 'AO-2026-001244',
    titre: 'Acquisition de gilets pare-balles et équipements de protection',
    description: `Le Ministère de l'Intérieur lance un appel d'offres pour la fourniture d'équipements de protection individuelle pour les forces de l'ordre.

Équipements requis :
- Gilets pare-balles niveau IIIA
- Casques balistiques
- Protège-genoux et coudes
- Ceinturons tactiques

Certification et homologation obligatoires.`,
    institution: 'Ministère de l\'Intérieur',
    module: 'equipements_militaires',
    categorie: 'Équipements de protection',
    motsCles: ['gilet pare-balles', 'protection', 'sécurité', 'militaire', 'équipement'],
    region: 'National',
    datePublication: '2026-01-27',
    dateLimite: '2026-03-10',
    montant: 320000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1244',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1244.pdf',
    statut: 'actif',
  },
  {
    id: '12',
    reference: 'AO-2026-001245',
    titre: 'Installation de systèmes de vidéosurveillance pour bâtiments administratifs',
    description: `La Présidence de la République lance un appel d'offres pour la mise en place de systèmes de vidéosurveillance et de contrôle d'accès dans plusieurs bâtiments administratifs.

Prestations :
- Installation de caméras IP haute définition
- Mise en place de systèmes de contrôle d'accès biométrique
- Centre de supervision
- Formation du personnel

Maintenance incluse pour 2 ans.`,
    institution: 'Présidence de la République',
    module: 'equipements_militaires',
    categorie: 'Systèmes de sécurité',
    motsCles: ['vidéosurveillance', 'caméra', 'sécurité', 'contrôle d\'accès', 'surveillance'],
    region: 'Dakar',
    datePublication: '2026-01-26',
    dateLimite: '2026-02-28',
    montant: 95000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1245',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1245.pdf',
    statut: 'actif',
  },
  // === MOBILIER ET ÉQUIPEMENTS HOSPITALIERS ===
  {
    id: '13',
    reference: 'AO-2026-001246',
    titre: 'Fourniture de lits médicalisés et mobilier pour l\'Hôpital Régional de Thiès',
    description: `Le Ministère de la Santé et de l'Action Sociale lance un appel d'offres pour l'équipement complet du nouveau pavillon de l'Hôpital Régional de Thiès.

Équipements demandés :
- Lits médicalisés électriques
- Tables de chevet à tiroirs
- Fauteuils de repos
- Chariots de soins
- Paravents

Installation et mise en service incluses.`,
    institution: 'Ministère de la Santé et de l\'Action Sociale',
    module: 'mobilier_hospitalier',
    categorie: 'Mobilier hospitalier',
    motsCles: ['lit médicalisé', 'hôpital', 'mobilier médical', 'santé', 'équipement hospitalier'],
    region: 'Thiès',
    datePublication: '2026-01-28',
    dateLimite: '2026-03-05',
    montant: 185000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1246',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1246.pdf',
    statut: 'actif',
  },
  {
    id: '14',
    reference: 'AO-2026-001247',
    titre: 'Acquisition d\'instruments chirurgicaux et matériel de stérilisation',
    description: `L'Hôpital Principal de Dakar recherche des fournisseurs pour l'acquisition de matériel médical de pointe pour les blocs opératoires.

Lot 1 - Instruments chirurgicaux :
- Sets de chirurgie générale
- Instruments de microchirurgie
- Matériel de laparoscopie

Lot 2 - Stérilisation :
- Autoclaves
- Indicateurs de stérilisation
- Conteneurs chirurgicaux`,
    institution: 'Hôpital Principal de Dakar',
    module: 'mobilier_hospitalier',
    categorie: 'Matériel médical',
    motsCles: ['instrument chirurgical', 'stérilisation', 'hôpital', 'bloc opératoire', 'médical'],
    region: 'Dakar',
    datePublication: '2026-01-25',
    dateLimite: '2026-02-20',
    montant: 275000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1247',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1247.pdf',
    statut: 'actif',
  },
  // === TEXTILES PROFESSIONNELS ET VÊTEMENTS DE TRAVAIL ===
  {
    id: '15',
    reference: 'AO-2026-001248',
    titre: 'Fourniture de blouses et tenues de protection pour personnel de laboratoire',
    description: `L'Institut Pasteur de Dakar lance un appel d'offres pour l'acquisition de vêtements de protection normés pour les techniciens de laboratoire.

Articles demandés :
- Blouses de laboratoire (blanches et colorées)
- Combinaisons de protection
- Surchaussures
- Charlottes
- Gants de protection

Conformité aux normes de biosécurité exigée.`,
    institution: 'Institut Pasteur de Dakar',
    module: 'textiles_professionnels',
    categorie: 'Vêtements de protection',
    motsCles: ['blouse', 'laboratoire', 'protection', 'textile professionnel', 'EPI'],
    region: 'Dakar',
    datePublication: '2026-01-26',
    dateLimite: '2026-02-18',
    montant: 22000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1248',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1248.pdf',
    statut: 'actif',
  },
  {
    id: '16',
    reference: 'AO-2026-001249',
    titre: 'Confection de gilets haute visibilité pour agents de voirie',
    description: `La Mairie de Dakar recherche un fabricant pour la confection de vêtements de travail réfléchissants conformes aux normes de sécurité pour les agents de voirie.

Articles demandés :
- Gilets haute visibilité classe 2
- Pantalons avec bandes réfléchissantes
- Vestes de pluie fluorescentes
- Casquettes de signalisation

Personnalisation avec le logo de la ville.`,
    institution: 'Mairie de Dakar',
    module: 'textiles_professionnels',
    categorie: 'Vêtements haute visibilité',
    motsCles: ['gilet', 'haute visibilité', 'sécurité', 'vêtement de travail', 'réfléchissant'],
    region: 'Dakar',
    datePublication: '2026-01-24',
    dateLimite: '2026-02-12',
    montant: 15000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1249',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1249.pdf',
    statut: 'actif',
  },
  // === BÂTIMENT ET TRAVAUX PUBLICS ===
  {
    id: '17',
    reference: 'AO-2026-001250',
    titre: 'Construction de 3 écoles élémentaires dans la région de Kaolack',
    description: `Le Ministère de l'Éducation Nationale lance un appel d'offres pour les travaux de construction de 3 bâtiments scolaires dans la région de Kaolack.

Chaque école comprendra :
- 6 salles de classe
- 1 bloc administratif
- 1 bloc sanitaire
- 1 cantine
- Aménagements extérieurs (cour, clôture)

Délai d'exécution : 12 mois.`,
    institution: 'Ministère de l\'Éducation Nationale',
    module: 'btp',
    categorie: 'Construction scolaire',
    motsCles: ['construction', 'école', 'bâtiment', 'travaux', 'BTP'],
    region: 'Kaolack',
    datePublication: '2026-01-27',
    dateLimite: '2026-03-15',
    montant: 850000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1250',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1250.pdf',
    statut: 'actif',
  },
  {
    id: '18',
    reference: 'AO-2026-001251',
    titre: 'Réhabilitation et rénovation du Palais de Justice de Saint-Louis',
    description: `Le Ministère de la Justice lance un appel d'offres pour les travaux de réhabilitation du Palais de Justice de Saint-Louis.

Travaux prévus :
- Réfection de la toiture
- Ravalement de façades
- Rénovation électrique complète
- Mise aux normes des sanitaires
- Peinture intérieure et extérieure
- Aménagement paysager

Respect du patrimoine architectural exigé.`,
    institution: 'Ministère de la Justice',
    module: 'btp',
    categorie: 'Réhabilitation',
    motsCles: ['réhabilitation', 'rénovation', 'bâtiment', 'travaux', 'génie civil'],
    region: 'Saint-Louis',
    datePublication: '2026-01-25',
    dateLimite: '2026-03-01',
    montant: 425000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1251',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1251.pdf',
    statut: 'actif',
  },
  // === FABRICATION MÉTALLIQUE ET STRUCTURES ===
  {
    id: '19',
    reference: 'AO-2026-001252',
    titre: 'Fabrication et installation de charpentes métalliques pour hangars agricoles',
    description: `Le Ministère de l'Agriculture lance un appel d'offres pour la construction de structures métalliques pour 5 hangars de stockage de 500m² chacun dans la région de Tambacounda.

Caractéristiques :
- Charpente en acier galvanisé
- Couverture en tôle bac acier
- Hauteur sous poutre : 6 mètres
- Portes coulissantes
- Ventilation naturelle

Fondations incluses dans le marché.`,
    institution: 'Ministère de l\'Agriculture',
    module: 'fabrication_metallique',
    categorie: 'Charpente métallique',
    motsCles: ['charpente métallique', 'hangar', 'structure métallique', 'soudure', 'acier'],
    region: 'Tambacounda',
    datePublication: '2026-01-28',
    dateLimite: '2026-03-10',
    montant: 180000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1252',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1252.pdf',
    statut: 'actif',
  },
  {
    id: '20',
    reference: 'AO-2026-001253',
    titre: 'Fourniture et pose de portails et clôtures métalliques pour lycées',
    description: `L'Inspection d'Académie de Ziguinchor recherche des entreprises de serrurerie pour la fourniture et pose de portails et clôtures pour 8 lycées.

Travaux :
- Portails coulissants motorisés
- Grillages périphériques
- Portillons d'accès
- Peinture antirouille

Durée des travaux : 4 mois.`,
    institution: 'Inspection d\'Académie de Ziguinchor',
    module: 'fabrication_metallique',
    categorie: 'Serrurerie',
    motsCles: ['portail', 'clôture', 'serrurerie', 'métallique', 'grillage'],
    region: 'Ziguinchor',
    datePublication: '2026-01-26',
    dateLimite: '2026-02-22',
    montant: 45000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1253',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1253.pdf',
    statut: 'actif',
  },
  // === MAINTENANCE INDUSTRIELLE ET TECHNIQUE ===
  {
    id: '21',
    reference: 'AO-2026-001254',
    titre: 'Contrat de maintenance préventive des équipements industriels de la SONACOS',
    description: `La SONACOS lance un appel d'offres pour un contrat de maintenance préventive et curative de ses équipements industriels sur le site de Kaolack.

Équipements concernés :
- Presses d'extraction
- Convoyeurs et élévateurs
- Chaudières
- Compresseurs
- Systèmes de pompage

Contrat de 3 ans avec interventions programmées et d'urgence.`,
    institution: 'SONACOS',
    module: 'maintenance_industrielle',
    categorie: 'Maintenance préventive',
    motsCles: ['maintenance industrielle', 'équipement', 'machines', 'préventive', 'technique'],
    region: 'Kaolack',
    datePublication: '2026-01-27',
    dateLimite: '2026-02-25',
    montant: 125000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1254',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1254.pdf',
    statut: 'actif',
  },
  {
    id: '22',
    reference: 'AO-2026-001255',
    titre: 'Réparation et remise en état de la ligne de production de la CSS',
    description: `La Compagnie Sucrière Sénégalaise recherche des prestataires pour le diagnostic et la remise en état de la chaîne de production sucrière.

Travaux attendus :
- Diagnostic complet de la ligne
- Remplacement des pièces usées
- Recalibrage des équipements
- Tests et mise en service
- Formation du personnel de maintenance

Intervention pendant l'inter-campagne.`,
    institution: 'Compagnie Sucrière Sénégalaise',
    module: 'maintenance_industrielle',
    categorie: 'Réparation industrielle',
    motsCles: ['réparation', 'dépannage', 'industriel', 'production', 'maintenance'],
    region: 'Saint-Louis',
    datePublication: '2026-01-25',
    dateLimite: '2026-02-18',
    montant: 95000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1255',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1255.pdf',
    statut: 'actif',
  },
  // === ÉQUIPEMENTS AGRICOLES ET AGRO-INDUSTRIELS ===
  {
    id: '23',
    reference: 'AO-2026-001256',
    titre: 'Acquisition de tracteurs et matériel agricole pour coopératives',
    description: `Le Ministère de l'Agriculture et de l'Équipement Rural lance un appel d'offres pour la fourniture de matériel agricole dans le cadre du programme d'équipement rural.

Matériel demandé :
- 20 tracteurs 75 CV
- 20 charrues à disques
- 15 semoirs mécaniques
- 10 pulvérisateurs tractés
- Pièces de rechange

Formation des utilisateurs incluse.`,
    institution: 'Ministère de l\'Agriculture et de l\'Équipement Rural',
    module: 'equipements_agricoles',
    categorie: 'Matériel agricole',
    motsCles: ['tracteur', 'matériel agricole', 'semoir', 'agriculture', 'équipement rural'],
    region: 'National',
    datePublication: '2026-01-28',
    dateLimite: '2026-03-20',
    montant: 650000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1256',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1256.pdf',
    statut: 'actif',
  },
  {
    id: '24',
    reference: 'AO-2026-001257',
    titre: 'Installation de systèmes d\'irrigation goutte-à-goutte pour périmètres maraîchers',
    description: `La SAED (Société d'Aménagement des Eaux du Delta) lance un appel d'offres pour l'équipement de 50 hectares de périmètres maraîchers en système d'irrigation moderne.

Équipements :
- Système de pompage solaire
- Réservoirs de stockage
- Réseau de distribution
- Goutteurs et asperseurs
- Automatisation

Installation et mise en service incluses.`,
    institution: 'SAED (Société d\'Aménagement des Eaux du Delta)',
    module: 'equipements_agricoles',
    categorie: 'Irrigation agricole',
    motsCles: ['irrigation', 'pompage', 'agricole', 'solaire', 'goutte-à-goutte'],
    region: 'Saint-Louis',
    datePublication: '2026-01-26',
    dateLimite: '2026-02-28',
    montant: 220000000,
    devise: 'XOF',
    urlSource: 'http://www.marchespublics.sn/detail/1257',
    daoSourceUrl: 'http://www.marchespublics.sn/documents/dao-1257.pdf',
    statut: 'actif',
  },
];

/**
 * Trouve un appel d'offres par son ID
 */
export function getTenderById(id: string): MockTender | undefined {
  return mockTenders.find((tender) => tender.id === id);
}

/**
 * Filtre les appels d'offres selon les critères
 */
export function filterTenders(options?: {
  module?: string;
  region?: string;
  q?: string;
}): MockTender[] {
  let filtered = [...mockTenders];

  if (options?.module) {
    const modules = options.module.split(',');
    filtered = filtered.filter((t) => modules.includes(t.module));
  }

  if (options?.region) {
    filtered = filtered.filter((t) => t.region === options.region);
  }

  if (options?.q) {
    const query = options.q.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.titre.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.institution.toLowerCase().includes(query) ||
        t.motsCles.some((k) => k.toLowerCase().includes(query))
    );
  }

  return filtered;
}
