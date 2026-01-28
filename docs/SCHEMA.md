# 📊 Schéma de Données - PMN Marchés Publics

## Classes Parse Server (Back4App)

### 1. AppelOffre

Table principale contenant tous les appels d'offres scrapés.

```typescript
interface AppelOffre {
  // Identifiants
  objectId: string;           // ID Parse (auto)
  reference: string;          // Référence unique de l'appel d'offre
  
  // Informations générales
  titre: string;              // Titre de l'appel d'offre
  description: string;        // Description complète
  institution: string;        // Institution émettrice
  
  // Classification
  categorie: string;          // Catégorie source (du site)
  module: 'entretiens' | 'tenues' | 'achats';  // Module PMN
  motsCles: string[];         // Mots-clés extraits
  
  // Dates
  datePublication: Date;      // Date de publication
  dateLimite: Date;           // Date limite de soumission
  
  // Localisation
  region: string;             // Région concernée
  
  // Financier
  montant?: number;           // Montant estimé (si disponible)
  devise?: string;            // Devise (XOF par défaut)
  
  // Liens
  urlSource: string;          // URL originale sur marchespublics.sn
  urlDossier?: string;        // URL du dossier à télécharger
  
  // Métadonnées
  statut: 'actif' | 'expire' | 'attribue' | 'annule';
  sourceHash: string;         // Hash pour détecter les modifications
  derniereSynchronisation: Date;
  
  // Parse standard
  createdAt: Date;
  updatedAt: Date;
  ACL: ParseACL;
}
```

**Index recommandés :**
- `reference` (unique)
- `module`
- `dateLimite`
- `region`
- `statut`

### 2. Document

Fichiers associés aux appels d'offres (DAO, cahiers des charges, etc.)

```typescript
interface Document {
  objectId: string;
  
  // Relation
  appelOffre: Pointer<AppelOffre>;
  
  // Fichier
  nom: string;                // Nom du document
  type: 'dao' | 'cahier_charges' | 'annexe' | 'autre';
  fichier?: ParseFile;        // Fichier stocké sur Parse
  urlExterne?: string;        // URL externe si non téléchargeable
  
  // Métadonnées
  taille?: number;            // Taille en bytes
  format: string;             // Extension (pdf, doc, etc.)
  
  createdAt: Date;
  updatedAt: Date;
  ACL: ParseACL;
}
```

### 3. Artisan (extends _User)

Utilisateurs de la plateforme - hérite de la classe _User de Parse.

```typescript
interface Artisan extends Parse.User {
  objectId: string;
  username: string;           // Email comme username
  email: string;
  
  // Profil
  nom: string;
  prenom: string;
  telephone: string;
  whatsapp?: string;          // Numéro WhatsApp (peut différer)
  
  // Activité
  metier: string;             // Métier principal
  specialites: string[];      // Spécialités
  entreprise?: string;        // Nom de l'entreprise
  ninea?: string;             // Numéro NINEA
  
  // Localisation
  region: string;
  adresse?: string;
  
  // Préférences alertes
  alertesEmail: boolean;
  alertesWhatsapp: boolean;
  modulesAlertes: ('entretiens' | 'tenues' | 'achats')[];
  regionsAlertes: string[];
  
  // Rôle
  role: 'artisan' | 'admin';
  
  // Statut
  estVerifie: boolean;
  dateInscription: Date;
  derniereConnexion: Date;
  
  createdAt: Date;
  updatedAt: Date;
  ACL: ParseACL;
}
```

### 4. Favori

Appels d'offres marqués en favoris par les artisans.

```typescript
interface Favori {
  objectId: string;
  
  // Relations
  artisan: Pointer<Artisan>;
  appelOffre: Pointer<AppelOffre>;
  
  // Métadonnées
  notes?: string;             // Notes personnelles
  rappel?: Date;              // Date de rappel optionnelle
  
  createdAt: Date;
  updatedAt: Date;
  ACL: ParseACL;              // Privé à l'artisan
}
```

### 5. Historique

Historique de consultation des appels d'offres.

```typescript
interface Historique {
  objectId: string;
  
  // Relations
  artisan: Pointer<Artisan>;
  appelOffre: Pointer<AppelOffre>;
  
  // Données
  dateConsultation: Date;
  dureeConsultation?: number; // Durée en secondes
  action: 'vue' | 'telechargement' | 'partage';
  
  createdAt: Date;
  ACL: ParseACL;              // Privé à l'artisan
}
```

### 6. Alerte

Configuration des alertes personnalisées.

```typescript
interface Alerte {
  objectId: string;
  
  // Relation
  artisan: Pointer<Artisan>;
  
  // Configuration
  nom: string;                // Nom de l'alerte
  actif: boolean;
  
  // Critères
  modules: ('entretiens' | 'tenues' | 'achats')[];
  regions: string[];
  motsCles: string[];
  montantMin?: number;
  montantMax?: number;
  
  // Canaux
  email: boolean;
  whatsapp: boolean;
  push: boolean;
  
  // Fréquence
  frequence: 'instantanee' | 'quotidienne' | 'hebdomadaire';
  heureEnvoi?: string;        // Pour quotidienne/hebdomadaire (ex: "08:00")
  
  // Stats
  nombreEnvois: number;
  dernierEnvoi?: Date;
  
  createdAt: Date;
  updatedAt: Date;
  ACL: ParseACL;
}
```

### 7. NotificationLog

Logs des notifications envoyées.

```typescript
interface NotificationLog {
  objectId: string;
  
  // Relations
  artisan: Pointer<Artisan>;
  alerte?: Pointer<Alerte>;
  appelOffre?: Pointer<AppelOffre>;
  
  // Détails
  type: 'email' | 'whatsapp' | 'push';
  statut: 'envoye' | 'echec' | 'en_attente';
  
  // Contenu
  destinataire: string;       // Email ou numéro
  sujet?: string;
  contenu: string;
  
  // Erreur
  erreur?: string;
  
  createdAt: Date;
  ACL: ParseACL;
}
```

### 8. ScrapingLog

Logs des opérations de scraping.

```typescript
interface ScrapingLog {
  objectId: string;
  
  // Session
  sessionId: string;
  
  // Résultats
  statut: 'succes' | 'partiel' | 'echec';
  dateDebut: Date;
  dateFin: Date;
  dureeMs: number;
  
  // Statistiques
  pagesScrapees: number;
  nouveauxAppels: number;
  appelsModifies: number;
  erreurs: number;
  
  // Détails
  logs: {
    timestamp: Date;
    niveau: 'info' | 'warn' | 'error';
    message: string;
    donnees?: object;
  }[];
  
  // Problèmes détectés
  changementsStructure: {
    selecteur: string;
    description: string;
  }[];
  
  createdAt: Date;
  ACL: ParseACL;              // Admin seulement
}
```

### 9. Configuration

Paramètres de configuration du système.

```typescript
interface Configuration {
  objectId: string;
  
  cle: string;                // Clé unique
  valeur: any;                // Valeur (JSON supporté)
  type: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  
  // Métadonnées
  modifiePar?: Pointer<Artisan>;
  
  createdAt: Date;
  updatedAt: Date;
  ACL: ParseACL;              // Admin seulement
}
```

**Exemples de configurations :**

| Clé | Valeur | Description |
|-----|--------|-------------|
| `scraping.cron` | `"0 6,12,18 * * *"` | Schedule CRON |
| `scraping.timeout` | `30000` | Timeout en ms |
| `classification.entretiens.keywords` | `["nettoyage", "maintenance"]` | Mots-clés |
| `notifications.email.from` | `"noreply@pmn.sn"` | Email expéditeur |

---

## Relations

```
┌──────────────┐
│  AppelOffre  │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│   Document   │
└──────────────┘

┌──────────────┐       ┌──────────────┐
│   Artisan    │ ─────▶│    Favori    │──────▶ AppelOffre
└──────────────┘  1:N  └──────────────┘   N:1
       │
       │ 1:N
       ▼
┌──────────────┐
│  Historique  │──────▶ AppelOffre
└──────────────┘   N:1

┌──────────────┐       ┌──────────────┐
│   Artisan    │ ─────▶│   Alerte     │
└──────────────┘  1:N  └──────────────┘
```

---

## Règles ACL

### Matrice des permissions

| Classe | Public Read | Public Write | Owner Read | Owner Write | Admin Read | Admin Write |
|--------|-------------|--------------|------------|-------------|------------|-------------|
| AppelOffre | ✅ | ❌ | - | - | ✅ | ✅ |
| Document | ✅ | ❌ | - | - | ✅ | ✅ |
| Artisan | ❌ | ❌ | ✅ | ✅* | ✅ | ✅ |
| Favori | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Historique | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Alerte | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| NotificationLog | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| ScrapingLog | ❌ | ❌ | - | - | ✅ | ✅ |
| Configuration | ❌ | ❌ | - | - | ✅ | ✅ |

*Certains champs sont protégés (role, estVerifie)

---

## Régions du Sénégal

Valeurs autorisées pour le champ `region` :

```typescript
const REGIONS_SENEGAL = [
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
  'National' // Pour les appels d'offres nationaux
] as const;
```

---

## Modules PMN

Classification des appels d'offres :

```typescript
const MODULES_PMN = {
  entretiens: {
    nom: 'Entretiens',
    description: 'Nettoyage, maintenance, gardiennage',
    icone: '🧹',
    couleur: '#10B981'
  },
  tenues: {
    nom: 'Tenues',
    description: 'Uniformes, habillement, textile, couture',
    icone: '👔',
    couleur: '#6366F1'
  },
  achats: {
    nom: 'Achats',
    description: 'Mobilier, équipements, fournitures',
    icone: '🪑',
    couleur: '#F59E0B'
  }
} as const;
```

---

## Migration / Seed Data

Script d'initialisation des données de base :

```typescript
// Rôles
const roles = [
  { name: 'admin', description: 'Administrateur système' },
  { name: 'artisan', description: 'Artisan inscrit' }
];

// Configuration initiale
const configs = [
  { cle: 'scraping.actif', valeur: true, type: 'boolean' },
  { cle: 'scraping.cron', valeur: '0 6,12,18 * * *', type: 'string' },
  { cle: 'app.maintenance', valeur: false, type: 'boolean' },
  { cle: 'app.version', valeur: '1.0.0', type: 'string' }
];
```
