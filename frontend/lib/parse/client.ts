// @ts-ignore - Parse SDK types
import Parse from 'parse';

// Configuration Parse - côté client
const PARSE_APPLICATION_ID = process.env.NEXT_PUBLIC_PARSE_APPLICATION_ID || '';
const PARSE_JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_PARSE_JAVASCRIPT_KEY || '';
const PARSE_SERVER_URL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL || 'https://parseapi.back4app.com';

let isInitialized = false;

export function initializeParse() {
  if (isInitialized) return;
  
  if (!PARSE_APPLICATION_ID) {
    console.warn('Parse Application ID not configured');
    return;
  }

  Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
  (Parse as any).serverURL = PARSE_SERVER_URL;
  
  isInitialized = true;
}

// Type pour tous les modules PMN
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

// Types pour les objets Parse
export interface AppelOffreData {
  objectId: string;
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
  devise: string;
  /** URL de la page de l'appel d'offres sur le portail officiel */
  urlSource: string;
  /** Fichier DAO hébergé sur PMN/Back4App (téléchargement direct) */
  daoFile?: string;
  /** URL du DAO sur le site source (peut être bloqué) */
  daoSourceUrl?: string;
  statut: 'actif' | 'expire' | 'attribue' | 'annule';
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtisanData {
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
  region: string;
  adresse?: string;
  alertesEmail: boolean;
  alertesWhatsapp: boolean;
  modulesAlertes: string[];
  regionsAlertes: string[];
  role: 'artisan' | 'admin';
  estVerifie: boolean;
}

export interface FavoriData {
  objectId: string;
  artisan: ArtisanData;
  appelOffre: AppelOffreData;
  notes?: string;
  rappel?: Date;
  createdAt: Date;
}

export interface FiltersParams {
  module?: string;
  region?: string;
  search?: string;
  statut?: string;
  dateDebut?: string;
  dateFin?: string;
  page?: number;
  limit?: number;
}

// Service pour les appels d'offres
export const AppelOffreService = {
  async getAll(filters: FiltersParams = {}): Promise<{ data: AppelOffreData[]; total: number }> {
    initializeParse();
    
    const AppelOffre = Parse.Object.extend('AppelOffre');
    const query = new Parse.Query(AppelOffre);

    // Filtres
    if (filters.module) {
      query.equalTo('module', filters.module);
    }
    
    if (filters.region && filters.region !== 'all') {
      query.equalTo('region', filters.region);
    }
    
    if (filters.statut) {
      query.equalTo('statut', filters.statut);
    } else {
      // Par défaut, on ne montre que les appels actifs
      query.equalTo('statut', 'actif');
    }
    
    if (filters.search) {
      // Recherche dans le titre, description et institution
      // Utilise fullText si disponible, sinon matches pour une recherche partielle
      query.matches('titre', new RegExp(filters.search, 'i'));
    }
    
    if (filters.dateDebut) {
      query.greaterThanOrEqualTo('dateLimite', new Date(filters.dateDebut));
    }
    
    if (filters.dateFin) {
      query.lessThanOrEqualTo('dateLimite', new Date(filters.dateFin));
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    query.skip((page - 1) * limit);
    query.limit(limit);
    
    // Tri par date limite (les plus urgents en premier)
    query.ascending('dateLimite');

    try {
      const [results, total] = await Promise.all([
        query.find(),
        query.count(),
      ]);

      const data = results.map((obj: any) => ({
        objectId: obj.id,
        reference: obj.get('reference'),
        titre: obj.get('titre'),
        description: obj.get('description'),
        institution: obj.get('institution'),
        categorie: obj.get('categorie'),
        module: obj.get('module'),
        motsCles: obj.get('motsCles') || [],
        datePublication: obj.get('datePublication'),
        dateLimite: obj.get('dateLimite'),
        region: obj.get('region'),
        montant: obj.get('montant'),
        devise: obj.get('devise') || 'XOF',
        urlSource: obj.get('urlSource'),
        daoFile: obj.get('daoFile'),
        daoSourceUrl: obj.get('daoSourceUrl') || obj.get('urlDossier'),
        statut: obj.get('statut'),
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
      })) as AppelOffreData[];

      return { data, total };
    } catch (error) {
      console.error('Erreur lors de la récupération des appels d\'offres:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<AppelOffreData | null> {
    initializeParse();
    
    const AppelOffre = Parse.Object.extend('AppelOffre');
    const query = new Parse.Query(AppelOffre);

    try {
      const obj = await query.get(id);
      
      return {
        objectId: obj.id,
        reference: obj.get('reference'),
        titre: obj.get('titre'),
        description: obj.get('description'),
        institution: obj.get('institution'),
        categorie: obj.get('categorie'),
        module: obj.get('module'),
        motsCles: obj.get('motsCles') || [],
        datePublication: obj.get('datePublication'),
        dateLimite: obj.get('dateLimite'),
        region: obj.get('region'),
        montant: obj.get('montant'),
        devise: obj.get('devise') || 'XOF',
        urlSource: obj.get('urlSource'),
        daoFile: obj.get('daoFile'),
        daoSourceUrl: obj.get('daoSourceUrl') || obj.get('urlDossier'),
        statut: obj.get('statut'),
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'appel d\'offre:', error);
      return null;
    }
  },

  async getStats(): Promise<{ entretiens: number; tenues: number; achats: number; total: number }> {
    initializeParse();
    
    const AppelOffre = Parse.Object.extend('AppelOffre');
    
    const [entretiens, tenues, achats] = await Promise.all([
      new Parse.Query(AppelOffre).equalTo('module', 'entretiens').equalTo('statut', 'actif').count(),
      new Parse.Query(AppelOffre).equalTo('module', 'tenues').equalTo('statut', 'actif').count(),
      new Parse.Query(AppelOffre).equalTo('module', 'achats').equalTo('statut', 'actif').count(),
    ]);

    return {
      entretiens,
      tenues,
      achats,
      total: entretiens + tenues + achats,
    };
  },
};

// Service pour l'authentification
export const AuthService = {
  async signUp(data: {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    telephone: string;
    metier: string;
    region: string;
  }): Promise<ArtisanData> {
    initializeParse();
    
    const user = new Parse.User();
    user.set('username', data.email);
    user.set('email', data.email);
    user.set('password', data.password);
    user.set('nom', data.nom);
    user.set('prenom', data.prenom);
    user.set('telephone', data.telephone);
    user.set('metier', data.metier);
    user.set('region', data.region);
    user.set('role', 'artisan');
    user.set('alertesEmail', true);
    user.set('alertesWhatsapp', false);
    user.set('modulesAlertes', []);
    user.set('regionsAlertes', []);
    user.set('estVerifie', false);

    try {
      await user.signUp();
      return {
        objectId: user.id,
        nom: user.get('nom'),
        prenom: user.get('prenom'),
        email: user.get('email'),
        telephone: user.get('telephone'),
        metier: user.get('metier'),
        region: user.get('region'),
        role: user.get('role'),
        alertesEmail: user.get('alertesEmail'),
        alertesWhatsapp: user.get('alertesWhatsapp'),
        modulesAlertes: user.get('modulesAlertes'),
        regionsAlertes: user.get('regionsAlertes'),
        estVerifie: user.get('estVerifie'),
        specialites: user.get('specialites') || [],
      };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  async logIn(email: string, password: string): Promise<ArtisanData> {
    initializeParse();
    
    try {
      const user = await Parse.User.logIn(email, password);
      return {
        objectId: user.id,
        nom: user.get('nom'),
        prenom: user.get('prenom'),
        email: user.get('email'),
        telephone: user.get('telephone'),
        metier: user.get('metier'),
        region: user.get('region'),
        role: user.get('role'),
        alertesEmail: user.get('alertesEmail'),
        alertesWhatsapp: user.get('alertesWhatsapp'),
        modulesAlertes: user.get('modulesAlertes'),
        regionsAlertes: user.get('regionsAlertes'),
        estVerifie: user.get('estVerifie'),
        specialites: user.get('specialites') || [],
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },

  async logOut(): Promise<void> {
    initializeParse();
    await Parse.User.logOut();
  },

  async getCurrentUser(): Promise<ArtisanData | null> {
    initializeParse();
    
    const user = Parse.User.current();
    if (!user) return null;

    return {
      objectId: user.id,
      nom: user.get('nom'),
      prenom: user.get('prenom'),
      email: user.get('email'),
      telephone: user.get('telephone'),
      metier: user.get('metier'),
      region: user.get('region'),
      role: user.get('role'),
      alertesEmail: user.get('alertesEmail'),
      alertesWhatsapp: user.get('alertesWhatsapp'),
      modulesAlertes: user.get('modulesAlertes'),
      regionsAlertes: user.get('regionsAlertes'),
      estVerifie: user.get('estVerifie'),
      specialites: user.get('specialites') || [],
    };
  },
};

// Service pour les favoris
export const FavoriService = {
  async add(appelOffreId: string): Promise<void> {
    initializeParse();
    
    const user = Parse.User.current();
    if (!user) throw new Error('Utilisateur non connecté');

    const Favori = Parse.Object.extend('Favori');
    const favori = new Favori();

    const AppelOffre = Parse.Object.extend('AppelOffre');
    const appelOffre = new AppelOffre();
    appelOffre.id = appelOffreId;

    favori.set('artisan', user);
    favori.set('appelOffre', appelOffre);

    // ACL - seul l'utilisateur peut voir/modifier ses favoris
    const acl = new Parse.ACL(user);
    acl.setRoleReadAccess('admin', true);
    favori.setACL(acl);

    await favori.save();
  },

  async remove(appelOffreId: string): Promise<void> {
    initializeParse();
    
    const user = Parse.User.current();
    if (!user) throw new Error('Utilisateur non connecté');

    const Favori = Parse.Object.extend('Favori');
    const query = new Parse.Query(Favori);
    
    const AppelOffre = Parse.Object.extend('AppelOffre');
    const appelOffre = new AppelOffre();
    appelOffre.id = appelOffreId;

    query.equalTo('artisan', user);
    query.equalTo('appelOffre', appelOffre);

    const favori = await query.first();
    if (favori) {
      await favori.destroy();
    }
  },

  async getAll(): Promise<FavoriData[]> {
    initializeParse();
    
    const user = Parse.User.current();
    if (!user) throw new Error('Utilisateur non connecté');

    const Favori = Parse.Object.extend('Favori');
    const query = new Parse.Query(Favori);
    
    query.equalTo('artisan', user);
    query.include('appelOffre');
    query.descending('createdAt');

    const results = await query.find();

    return results.map((obj: any) => {
      const appelOffre = obj.get('appelOffre');
      return {
        objectId: obj.id,
        artisan: user.toJSON() as unknown as ArtisanData,
        appelOffre: {
          objectId: appelOffre.id,
          reference: appelOffre.get('reference'),
          titre: appelOffre.get('titre'),
          description: appelOffre.get('description'),
          institution: appelOffre.get('institution'),
          categorie: appelOffre.get('categorie'),
          module: appelOffre.get('module'),
          motsCles: appelOffre.get('motsCles') || [],
          datePublication: appelOffre.get('datePublication'),
          dateLimite: appelOffre.get('dateLimite'),
          region: appelOffre.get('region'),
          montant: appelOffre.get('montant'),
          devise: appelOffre.get('devise') || 'XOF',
          urlSource: appelOffre.get('urlSource'),
          daoFile: appelOffre.get('daoFile'),
          daoSourceUrl: appelOffre.get('daoSourceUrl') || appelOffre.get('urlDossier'),
          statut: appelOffre.get('statut'),
          createdAt: appelOffre.createdAt,
          updatedAt: appelOffre.updatedAt,
        },
        notes: obj.get('notes'),
        rappel: obj.get('rappel'),
        createdAt: obj.createdAt,
      };
    });
  },

  async isFavorite(appelOffreId: string): Promise<boolean> {
    initializeParse();
    
    const user = Parse.User.current();
    if (!user) return false;

    const Favori = Parse.Object.extend('Favori');
    const query = new Parse.Query(Favori);
    
    const AppelOffre = Parse.Object.extend('AppelOffre');
    const appelOffre = new AppelOffre();
    appelOffre.id = appelOffreId;

    query.equalTo('artisan', user);
    query.equalTo('appelOffre', appelOffre);

    const count = await query.count();
    return count > 0;
  },
};

export default Parse;
