import { Injectable, Logger } from '@nestjs/common';

/**
 * Modules métiers PMN
 * - 3 modules historiques : entretiens, tenues, achats
 * - 9 nouveaux modules ajoutés
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

export interface ClassificationResult {
  module: ModulePMN;
  confidence: number;
  keywords: string[];
  matchedRules: string[];
}

/**
 * Service de classification des appels d'offres
 * 
 * Classifie automatiquement les appels d'offres dans l'un des 12 modules PMN.
 * La classification se base sur :
 * - Les mots-clés présents dans le titre et la description
 * - Les règles de catégories sources
 * - Des règles métier spécifiques
 */
@Injectable()
export class ClassificationService {
  private readonly logger = new Logger(ClassificationService.name);

  /**
   * Liste des modules avec module par défaut
   */
  private readonly defaultModule: ModulePMN = 'achats';

  /**
   * Mots-clés par module avec leur poids
   * Poids : 10 = très pertinent, 5 = moyennement pertinent
   */
  private readonly keywords: Record<ModulePMN, Record<string, number>> = {
    // ══════════════════════════════════════════════════════════════════
    // MODULE 1 : ENTRETIENS (Nettoyage, maintenance, gardiennage)
    // ══════════════════════════════════════════════════════════════════
    entretiens: {
      // Nettoyage
      'nettoyage': 10,
      'nettoiement': 10,
      'propreté': 8,
      'hygiène': 7,
      'désinfection': 8,
      'assainissement': 8,
      'balayage': 7,
      'lavage': 6,
      
      // Gardiennage et sécurité de proximité
      'gardiennage': 10,
      'surveillance': 9,
      'vigile': 9,
      'agent de sécurité': 10,
      'rondes': 7,
      
      // Espaces verts
      'espaces verts': 10,
      'jardinage': 9,
      'tonte': 8,
      'élagage': 8,
      'arrosage': 7,
      'paysagiste': 8,
      'pelouse': 7,
      
      // Services divers
      'prestation de service': 5,
      'services aux bâtiments': 7,
    },

    // ══════════════════════════════════════════════════════════════════
    // MODULE 2 : TENUES (Uniformes, habillement, textile)
    // ══════════════════════════════════════════════════════════════════
    tenues: {
      // Vêtements et uniformes
      'uniforme': 10,
      'uniformes': 10,
      'tenue': 9,
      'tenues': 9,
      'habillement': 10,
      
      // Confection
      'confection': 10,
      'couture': 9,
      'couturier': 9,
      
      // Types de tenues
      'costume': 8,
      'costumes': 8,
      'chemise': 7,
      'pantalon': 7,
      'blouse': 8,
      'combinaison': 7,
      
      // Tenues spécifiques
      'tenue de cérémonie': 8,
      'uniforme scolaire': 10,
      'tenue officielle': 9,
    },

    // ══════════════════════════════════════════════════════════════════
    // MODULE 3 : ACHATS (Mobilier, équipements, fournitures générales)
    // ══════════════════════════════════════════════════════════════════
    achats: {
      // Mobilier de bureau
      'mobilier': 10,
      'mobilier de bureau': 10,
      'meuble': 9,
      'meubles': 9,
      'bureau': 6,
      'chaise': 7,
      'table': 6,
      'armoire': 7,
      'étagère': 7,
      'rayonnage': 8,
      
      // Informatique
      'informatique': 8,
      'ordinateur': 9,
      'ordinateurs': 9,
      'imprimante': 8,
      'serveur informatique': 7,
      'logiciel': 6,
      
      // Fournitures
      'fourniture': 9,
      'fournitures': 9,
      'fournitures de bureau': 10,
      'consommable': 7,
      'papeterie': 8,
      'article de bureau': 8,
      
      // Acquisition générale
      'acquisition': 7,
      'achat': 6,
      'livraison': 5,
      'approvisionnement': 6,
    },

    // ══════════════════════════════════════════════════════════════════
    // MODULE 4 : VÉHICULES ET MAINTENANCE AUTOMOBILE
    // ══════════════════════════════════════════════════════════════════
    vehicules: {
      // Véhicules
      'véhicule': 10,
      'véhicules': 10,
      'voiture': 9,
      'voitures': 9,
      'automobile': 10,
      'automobiles': 10,
      'camion': 9,
      'camions': 9,
      'camionnette': 8,
      'fourgon': 8,
      'bus': 8,
      'autobus': 8,
      'minibus': 8,
      'motocyclette': 7,
      'moto': 7,
      'scooter': 7,
      'engin roulant': 8,
      
      // Pièces et accessoires
      'pièces détachées': 9,
      'pièces automobiles': 10,
      'pneumatique': 9,
      'pneu': 8,
      'pneus': 8,
      'batterie auto': 8,
      'huile moteur': 7,
      'lubrifiant': 7,
      'carburant': 6,
      
      // Maintenance automobile
      'maintenance automobile': 10,
      'entretien véhicule': 10,
      'réparation automobile': 10,
      'garage': 8,
      'vidange': 8,
      'révision véhicule': 9,
      'carrosserie': 8,
      'mécanique auto': 9,
      'contrôle technique': 8,
      
      // Location
      'location véhicule': 9,
      'location voiture': 9,
      'parc automobile': 9,
    },

    // ══════════════════════════════════════════════════════════════════
    // MODULE 5 : CHAUSSURES, MAROQUINERIE ET ARTICLES EN CUIR
    // ══════════════════════════════════════════════════════════════════
    chaussures_maroquinerie: {
      // Chaussures
      'chaussure': 10,
      'chaussures': 10,
      'botte': 9,
      'bottes': 9,
      'bottine': 8,
      'sandale': 7,
      'mocassin': 7,
      'escarpin': 7,
      'basket': 7,
      'chaussure de sécurité': 10,
      'chaussure de travail': 10,
      'brodequin': 9,
      'rangers': 9,
      
      // Maroquinerie
      'maroquinerie': 10,
      'sac': 8,
      'sac à main': 8,
      'sacoche': 8,
      'serviette': 7,
      'porte-document': 8,
      'cartable': 7,
      'valise': 7,
      'bagage': 7,
      
      // Cuir et accessoires
      'cuir': 9,
      'articles en cuir': 10,
      'ceinture': 8,
      'ceinturon': 9,
      'portefeuille': 7,
      'gant cuir': 8,
      'étui': 6,
      
      // Fabrication
      'cordonnerie': 9,
      'cordonnier': 9,
      'sellerie': 8,
      'tannerie': 8,
    },

    // ══════════════════════════════════════════════════════════════════
    // MODULE 6 : ÉQUIPEMENTS MILITAIRES ET DE SÉCURITÉ
    // ══════════════════════════════════════════════════════════════════
    equipements_militaires: {
      // Équipements militaires
      'équipement militaire': 10,
      'équipements militaires': 10,
      'matériel militaire': 10,
      'défense': 8,
      'armée': 9,
      'forces armées': 9,
      'gendarmerie': 9,
      'police': 8,
      
      // Armement et protection
      'armement': 10,
      'munition': 9,
      'munitions': 9,
      'gilet pare-balles': 10,
      'gilet tactique': 10,
      'casque balistique': 10,
      'casque militaire': 10,
      'blindage': 9,
      'bouclier': 8,
      
      // Tenues militaires
      'treillis': 10,
      'tenue de combat': 10,
      'uniforme militaire': 10,
      'tenue camouflage': 9,
      'rangers militaires': 9,
      
      // Équipements tactiques
      'équipement tactique': 10,
      'matériel de sécurité': 9,
      'détection': 7,
      'surveillance électronique': 8,
      'radio militaire': 8,
      'jumelles': 7,
      'vision nocturne': 9,
    },

    // ══════════════════════════════════════════════════════════════════
    // MODULE 7 : MOBILIER ET ÉQUIPEMENTS HOSPITALIERS
    // ══════════════════════════════════════════════════════════════════
    mobilier_hospitalier: {
      // Mobilier médical
      'mobilier hospitalier': 10,
      'mobilier médical': 10,
      'lit médical': 10,
      'lit hôpital': 10,
      'lit hospitalier': 10,
      'brancard': 9,
      'chariot médical': 9,
      'table d\'examen': 9,
      'table chirurgicale': 10,
      'fauteuil roulant': 9,
      'fauteuil médical': 9,
      
      // Équipements médicaux
      'équipement médical': 10,
      'équipement hospitalier': 10,
      'matériel médical': 10,
      'dispositif médical': 9,
      'appareil médical': 9,
      'imagerie médicale': 9,
      'radiologie': 8,
      'scanner': 8,
      'échographe': 9,
      'électrocardiographe': 9,
      'respirateur': 9,
      'défibrillateur': 9,
      'moniteur patient': 9,
      
      // Consommables médicaux
      'consommable médical': 8,
      'seringue': 7,
      'compresse': 7,
      'gant médical': 8,
      'masque chirurgical': 8,
      
      // Laboratoire
      'équipement laboratoire': 9,
      'laboratoire': 7,
      'microscope': 8,
      'centrifugeuse': 8,
      'réactif': 7,
    },

    // ══════════════════════════════════════════════════════════════════
    // MODULE 8 : TEXTILES PROFESSIONNELS ET VÊTEMENTS DE TRAVAIL
    // ══════════════════════════════════════════════════════════════════
    textiles_professionnels: {
      // Vêtements de travail
      'vêtement de travail': 10,
      'vêtements de travail': 10,
      'tenue de travail': 10,
      'bleu de travail': 10,
      'combinaison de travail': 10,
      'vêtement professionnel': 10,
      'veste de travail': 9,
      'pantalon de travail': 9,
      
      // EPI textiles
      'epi': 8,
      'équipement de protection individuelle': 10,
      'vêtement de protection': 10,
      'combinaison jetable': 8,
      'tablier': 7,
      'blouse de travail': 9,
      'surblouse': 8,
      
      // Textile technique
      'textile technique': 9,
      'textile professionnel': 10,
      'tissu ignifugé': 9,
      'tissu haute visibilité': 9,
      'gilet fluorescent': 8,
      'brassard': 7,
      
      // Linge professionnel
      'linge professionnel': 9,
      'linge hôtelier': 8,
      'drap': 6,
      'serviette': 6,
      'nappe': 6,
      'torchon': 6,
    },

    // ══════════════════════════════════════════════════════════════════
    // MODULE 9 : BÂTIMENT ET TRAVAUX PUBLICS (BTP)
    // ══════════════════════════════════════════════════════════════════
    btp: {
      // Construction
      'btp': 10,
      'bâtiment': 9,
      'construction': 10,
      'travaux publics': 10,
      'génie civil': 10,
      'ouvrage': 7,
      'chantier': 8,
      
      // Types de travaux
      'travaux de construction': 10,
      'travaux de rénovation': 9,
      'travaux de réhabilitation': 9,
      'travaux d\'extension': 8,
      'travaux de démolition': 8,
      'travaux de terrassement': 9,
      'travaux de voirie': 9,
      'travaux routiers': 9,
      'assainissement': 8,
      
      // Corps de métier
      'maçonnerie': 9,
      'plomberie': 8,
      'électricité bâtiment': 8,
      'menuiserie': 8,
      'peinture bâtiment': 8,
      'carrelage': 7,
      'étanchéité': 8,
      'toiture': 8,
      'charpente': 8,
      
      // Matériaux
      'ciment': 8,
      'béton': 9,
      'agrégat': 7,
      'sable': 6,
      'gravier': 6,
      'bitume': 8,
      'enrobé': 8,
    },

    // ══════════════════════════════════════════════════════════════════
    // MODULE 10 : FABRICATION MÉTALLIQUE ET STRUCTURES
    // ══════════════════════════════════════════════════════════════════
    fabrication_metallique: {
      // Métallurgie
      'métallurgie': 10,
      'métallique': 9,
      'métal': 8,
      'acier': 9,
      'fer': 8,
      'aluminium': 8,
      'inox': 8,
      'fonte': 7,
      
      // Structures
      'structure métallique': 10,
      'charpente métallique': 10,
      'ossature métallique': 10,
      'hangar métallique': 9,
      'bâtiment métallique': 9,
      'construction métallique': 10,
      
      // Fabrication
      'fabrication métallique': 10,
      'soudure': 9,
      'soudage': 9,
      'chaudronnerie': 10,
      'tôlerie': 9,
      'ferronnerie': 9,
      'forge': 8,
      'fonderie': 8,
      
      // Produits
      'poutrelle': 8,
      'profilé': 8,
      'tube acier': 8,
      'tôle': 8,
      'grille métallique': 8,
      'portail': 7,
      'clôture métallique': 8,
      'garde-corps': 8,
      'escalier métallique': 8,
    },

    // ══════════════════════════════════════════════════════════════════
    // MODULE 11 : MAINTENANCE INDUSTRIELLE ET TECHNIQUE
    // ══════════════════════════════════════════════════════════════════
    maintenance_industrielle: {
      // Maintenance
      'maintenance industrielle': 10,
      'maintenance technique': 10,
      'maintenance préventive': 9,
      'maintenance corrective': 9,
      'maintenance curative': 9,
      'entretien industriel': 9,
      'réparation industrielle': 9,
      
      // Équipements industriels
      'équipement industriel': 10,
      'machine industrielle': 10,
      'machine-outil': 9,
      'groupe électrogène': 9,
      'compresseur': 8,
      'pompe industrielle': 8,
      'moteur industriel': 8,
      'transformateur': 8,
      'onduleur': 8,
      
      // Installations
      'installation industrielle': 9,
      'climatisation industrielle': 8,
      'ventilation industrielle': 8,
      'chaufferie': 8,
      'réseau électrique': 8,
      'automatisme': 8,
      
      // Services
      'dépannage industriel': 9,
      'révision machine': 8,
      'calibration': 7,
      'métrologie': 7,
      'inspection technique': 8,
    },

    // ══════════════════════════════════════════════════════════════════
    // MODULE 12 : ÉQUIPEMENTS AGRICOLES ET AGRO-INDUSTRIELS
    // ══════════════════════════════════════════════════════════════════
    equipements_agricoles: {
      // Machines agricoles
      'équipement agricole': 10,
      'équipements agricoles': 10,
      'matériel agricole': 10,
      'machine agricole': 10,
      'tracteur': 10,
      'moissonneuse': 10,
      'batteuse': 9,
      'semoir': 9,
      'charrue': 9,
      'pulvérisateur': 8,
      'motoculteur': 8,
      
      // Irrigation
      'irrigation': 9,
      'système d\'irrigation': 10,
      'pompe agricole': 9,
      'goutte à goutte': 8,
      'aspersion': 8,
      'forage agricole': 8,
      
      // Stockage et transformation
      'silo': 9,
      'stockage agricole': 9,
      'chambre froide': 8,
      'séchoir': 8,
      'décortiqueuse': 9,
      'moulin': 8,
      'presse': 7,
      
      // Agro-industrie
      'agro-industrie': 10,
      'agro-industriel': 10,
      'agroalimentaire': 9,
      'transformation agricole': 9,
      'conditionnement': 7,
      'emballage agricole': 8,
      
      // Élevage
      'élevage': 8,
      'équipement élevage': 9,
      'abreuvoir': 8,
      'mangeoire': 8,
      'couveuse': 8,
      'clôture élevage': 7,
    },
  };

  /**
   * Règles de catégories sources vers modules
   */
  private readonly categoryRules: Record<string, ModulePMN> = {
    // Entretiens
    'nettoyage': 'entretiens',
    'entretien': 'entretiens',
    'gardiennage': 'entretiens',
    'espaces verts': 'entretiens',
    'services': 'entretiens',
    
    // Tenues
    'habillement': 'tenues',
    'confection': 'tenues',
    'uniforme': 'tenues',
    'vêtements': 'tenues',
    
    // Achats
    'fournitures': 'achats',
    'fournitures de bureau': 'achats',
    'mobilier': 'achats',
    'informatique': 'achats',
    
    // Véhicules
    'véhicules': 'vehicules',
    'automobile': 'vehicules',
    'transport': 'vehicules',
    'parc auto': 'vehicules',
    
    // Chaussures et maroquinerie
    'chaussures': 'chaussures_maroquinerie',
    'maroquinerie': 'chaussures_maroquinerie',
    'cuir': 'chaussures_maroquinerie',
    
    // Équipements militaires
    'défense': 'equipements_militaires',
    'militaire': 'equipements_militaires',
    'sécurité': 'equipements_militaires',
    'armement': 'equipements_militaires',
    
    // Mobilier hospitalier
    'médical': 'mobilier_hospitalier',
    'hospitalier': 'mobilier_hospitalier',
    'santé': 'mobilier_hospitalier',
    'équipement médical': 'mobilier_hospitalier',
    
    // Textiles professionnels
    'textile': 'textiles_professionnels',
    'vêtements de travail': 'textiles_professionnels',
    'epi': 'textiles_professionnels',
    
    // BTP
    'btp': 'btp',
    'travaux': 'btp',
    'construction': 'btp',
    'génie civil': 'btp',
    'travaux publics': 'btp',
    
    // Fabrication métallique
    'métallurgie': 'fabrication_metallique',
    'métallique': 'fabrication_metallique',
    'charpente métallique': 'fabrication_metallique',
    
    // Maintenance industrielle
    'maintenance': 'maintenance_industrielle',
    'maintenance industrielle': 'maintenance_industrielle',
    'équipement industriel': 'maintenance_industrielle',
    
    // Équipements agricoles
    'agricole': 'equipements_agricoles',
    'agriculture': 'equipements_agricoles',
    'agro-industrie': 'equipements_agricoles',
  };

  /**
   * Classifie un appel d'offre dans l'un des modules PMN
   */
  classify(
    titre: string,
    description: string,
    categorie?: string,
  ): ClassificationResult {
    const text = `${titre} ${description}`.toLowerCase();
    const matchedRules: string[] = [];
    const extractedKeywords: string[] = [];

    // Initialiser les scores pour tous les modules
    const scores: Record<ModulePMN, number> = {
      entretiens: 0,
      tenues: 0,
      achats: 0,
      vehicules: 0,
      chaussures_maroquinerie: 0,
      equipements_militaires: 0,
      mobilier_hospitalier: 0,
      textiles_professionnels: 0,
      btp: 0,
      fabrication_metallique: 0,
      maintenance_industrielle: 0,
      equipements_agricoles: 0,
    };

    // 1. Vérifier les règles de catégorie
    if (categorie) {
      const categoryLower = categorie.toLowerCase();
      for (const [keyword, module] of Object.entries(this.categoryRules)) {
        if (categoryLower.includes(keyword)) {
          scores[module] += 20;
          matchedRules.push(`category:${keyword}`);
        }
      }
    }

    // 2. Calculer les scores basés sur les mots-clés
    for (const [module, keywords] of Object.entries(this.keywords) as [ModulePMN, Record<string, number>][]) {
      for (const [keyword, weight] of Object.entries(keywords)) {
        const keywordLower = keyword.toLowerCase();
        
        if (text.includes(keywordLower)) {
          scores[module] += weight;
          extractedKeywords.push(keyword);
          matchedRules.push(`keyword:${keyword}`);
          
          // Bonus si le mot-clé est dans le titre
          if (titre.toLowerCase().includes(keywordLower)) {
            scores[module] += Math.floor(weight * 0.5);
          }
        }
      }
    }

    // 3. Règles métier spécifiques
    this.applyBusinessRules(text, scores, matchedRules);

    // 4. Déterminer le module avec le score le plus élevé
    let maxScore = 0;
    let selectedModule: ModulePMN = this.defaultModule;

    for (const [module, score] of Object.entries(scores) as [ModulePMN, number][]) {
      if (score > maxScore) {
        maxScore = score;
        selectedModule = module;
      }
    }

    // 5. Calculer le niveau de confiance
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const confidence = totalScore > 0 ? Math.min(maxScore / totalScore, 1) : 0.5;

    // 6. Extraire les mots-clés uniques
    const uniqueKeywords = [...new Set(extractedKeywords)];

    this.logger.debug(
      `Classification: "${titre.substring(0, 50)}..." → ${selectedModule} (confiance: ${(confidence * 100).toFixed(0)}%)`,
    );

    return {
      module: selectedModule,
      confidence,
      keywords: uniqueKeywords.slice(0, 10),
      matchedRules,
    };
  }

  /**
   * Applique les règles métier spécifiques pour affiner la classification
   */
  private applyBusinessRules(
    text: string,
    scores: Record<ModulePMN, number>,
    matchedRules: string[],
  ): void {
    // Règle : "fourniture de tenues" → tenues (pas achats)
    if (text.includes('fourniture') && (text.includes('tenue') || text.includes('uniforme'))) {
      scores.tenues += 15;
      matchedRules.push('rule:fourniture_tenues');
    }

    // Règle : "marché de nettoyage" → entretiens
    if (text.includes('marché') && text.includes('nettoyage')) {
      scores.entretiens += 15;
      matchedRules.push('rule:marche_nettoyage');
    }

    // Règle : "acquisition de mobilier" → achats
    if (text.includes('acquisition') && text.includes('mobilier') && !text.includes('hospitalier') && !text.includes('médical')) {
      scores.achats += 15;
      matchedRules.push('rule:acquisition_mobilier');
    }

    // Règle : "acquisition de véhicules" → vehicules
    if ((text.includes('acquisition') || text.includes('achat')) && 
        (text.includes('véhicule') || text.includes('voiture') || text.includes('camion'))) {
      scores.vehicules += 15;
      matchedRules.push('rule:acquisition_vehicules');
    }

    // Règle : "travaux de construction" → btp
    if (text.includes('travaux') && 
        (text.includes('construction') || text.includes('réhabilitation') || text.includes('rénovation'))) {
      scores.btp += 15;
      matchedRules.push('rule:travaux_construction');
    }

    // Règle : "équipement médical" ou "hôpital" → mobilier_hospitalier
    if ((text.includes('hôpital') || text.includes('centre de santé') || text.includes('clinique')) &&
        (text.includes('équipement') || text.includes('mobilier'))) {
      scores.mobilier_hospitalier += 15;
      matchedRules.push('rule:equipement_hospitalier');
    }

    // Règle : "matériel agricole" → equipements_agricoles
    if ((text.includes('agricole') || text.includes('agriculture') || text.includes('rural')) &&
        (text.includes('équipement') || text.includes('matériel') || text.includes('machine'))) {
      scores.equipements_agricoles += 15;
      matchedRules.push('rule:materiel_agricole');
    }

    // Règle : "chaussures de sécurité" ou "chaussures de travail" → chaussures_maroquinerie
    if (text.includes('chaussure') && 
        (text.includes('sécurité') || text.includes('travail') || text.includes('protection'))) {
      scores.chaussures_maroquinerie += 15;
      matchedRules.push('rule:chaussures_securite');
    }

    // Règle : "équipement militaire" ou "défense nationale" → equipements_militaires
    if ((text.includes('militaire') || text.includes('défense') || text.includes('armée') || text.includes('gendarmerie')) &&
        (text.includes('équipement') || text.includes('matériel') || text.includes('fourniture'))) {
      scores.equipements_militaires += 15;
      matchedRules.push('rule:equipement_militaire');
    }

    // Règle : "structure métallique" ou "charpente métallique" → fabrication_metallique
    if (text.includes('métallique') && 
        (text.includes('structure') || text.includes('charpente') || text.includes('hangar'))) {
      scores.fabrication_metallique += 15;
      matchedRules.push('rule:structure_metallique');
    }

    // Règle : "maintenance" + "industriel/machine/équipement" → maintenance_industrielle
    if (text.includes('maintenance') && 
        (text.includes('industriel') || text.includes('machine') || text.includes('groupe électrogène'))) {
      scores.maintenance_industrielle += 15;
      matchedRules.push('rule:maintenance_industrielle');
    }

    // Règle : "vêtement de travail" ou "EPI" → textiles_professionnels
    if ((text.includes('vêtement de travail') || text.includes('tenue de travail') || 
         text.includes('epi') || text.includes('équipement de protection')) &&
        !text.includes('chaussure')) {
      scores.textiles_professionnels += 15;
      matchedRules.push('rule:vetement_travail');
    }
  }

  /**
   * Extrait les mots-clés pertinents d'un texte
   */
  extractKeywords(text: string): string[] {
    const textLower = text.toLowerCase();
    const keywords: string[] = [];

    for (const moduleKeywords of Object.values(this.keywords)) {
      for (const keyword of Object.keys(moduleKeywords)) {
        if (textLower.includes(keyword.toLowerCase())) {
          keywords.push(keyword);
        }
      }
    }

    return [...new Set(keywords)];
  }

  /**
   * Récupère les mots-clés d'un module
   */
  getModuleKeywords(module: ModulePMN): string[] {
    return Object.keys(this.keywords[module] || {});
  }

  /**
   * Retourne la liste de tous les modules disponibles
   */
  getAllModules(): ModulePMN[] {
    return Object.keys(this.keywords) as ModulePMN[];
  }
}
