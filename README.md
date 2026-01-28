# 🏛️ PMN - Plateforme Marchés Publics du Sénégal

> **Projet Mobilier National** - Plateforme officielle d'accès à la commande publique pour les artisans sénégalais

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Back4App](https://img.shields.io/badge/Back4App-Parse-green)](https://www.back4app.com/)

---

## 📋 Table des matières

- [Présentation](#-présentation)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Déploiement](#-déploiement)
- [Documentation API](#-documentation-api)

---

## 🎯 Présentation

Cette plateforme permet aux artisans sénégalais d'accéder facilement aux appels d'offres publics publiés sur [marchespublics.sn](http://www.marchespublics.sn). 

### Fonctionnalités principales

- ✅ **Scraping automatique** des appels d'offres (CRON quotidien)
- ✅ **Classification intelligente** en 3 modules métiers
- ✅ **Recherche avancée** avec filtres multiples
- ✅ **Alertes personnalisées** (Email / WhatsApp)
- ✅ **Favoris et historique** pour chaque artisan
- ✅ **Tableau de bord administrateur** complet

### Modules métiers

| Module | Description | Exemples |
|--------|-------------|----------|
| 🧹 **Entretiens** | Nettoyage, maintenance, gardiennage | Services d'entretien, sécurité |
| 👔 **Tenues** | Uniformes, habillement, textile | Couture, confection |
| 🪑 **Achats** | Mobilier, équipements, fournitures | Mobilier de bureau, matériel |

---

## 🏗️ Architecture

```
pmn-marches-publics/
├── frontend/                 # Application Next.js 15
│   ├── app/                  # App Router
│   ├── components/           # Composants React
│   ├── lib/                  # Utilitaires et services
│   └── public/               # Assets statiques
│
├── backend/                  # API NestJS
│   ├── src/
│   │   ├── scraping/         # Service de scraping
│   │   ├── classification/   # Moteur de classification
│   │   ├── notifications/    # Alertes email/WhatsApp
│   │   └── parse/            # Intégration Back4App
│   └── test/
│
├── docs/                     # Documentation technique
│   ├── ARCHITECTURE.md
│   ├── SCHEMA.md
│   └── DEPLOYMENT.md
│
└── shared/                   # Types partagés
    └── types/
```

### Schéma de données (Back4App)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   AppelOffre    │────▶│    Document     │     │     Artisan     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ titre           │     │ nom             │     │ nom             │
│ reference       │     │ url             │     │ email           │
│ institution     │     │ type            │     │ telephone       │
│ categorie       │     │ appelOffre*     │     │ whatsapp        │
│ module          │     └─────────────────┘     │ metier          │
│ datePublication │                             │ region          │
│ dateLimite      │     ┌─────────────────┐     │ alertes         │
│ region          │     │     Favori      │     └─────────────────┘
│ montant         │     ├─────────────────┤            │
│ description     │     │ artisan*        │────────────┘
│ urlSource       │     │ appelOffre*     │
│ statut          │     │ dateAjout       │
└─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│   Historique    │     │  Configuration  │
├─────────────────┤     ├─────────────────┤
│ artisan*        │     │ cle             │
│ appelOffre*     │     │ valeur          │
│ dateConsultation│     │ description     │
└─────────────────┘     └─────────────────┘
```

---

## 🚀 Installation

### Prérequis

- Node.js 20+
- pnpm (recommandé) ou npm
- Compte Back4App configuré

### Installation rapide

```bash
# Cloner le projet
git clone <repository>
cd pmn-marches-publics

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Lancer en développement
pnpm dev
```

### Installation détaillée

```bash
# Frontend
cd frontend
pnpm install
pnpm dev

# Backend (dans un autre terminal)
cd backend
pnpm install
pnpm start:dev
```

---

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine :

```env
# Back4App / Parse Server
PARSE_APPLICATION_ID=your_app_id
PARSE_JAVASCRIPT_KEY=your_js_key
PARSE_CLIENT_KEY=your_client_key
PARSE_REST_API_KEY=your_rest_key
PARSE_MASTER_KEY=your_master_key
PARSE_SERVER_URL=https://parseapi.back4app.com

# Scraping
SCRAPING_CRON_SCHEDULE="0 6,12,18 * * *"
SCRAPING_USER_AGENT="PMN-Bot/1.0"

# Notifications
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
WHATSAPP_API_KEY=your_whatsapp_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

⚠️ **IMPORTANT** : Ne jamais commiter les clés dans le code source !

---

## 🌐 Déploiement

### Recommandations

| Service | Plateforme recommandée | Raison |
|---------|------------------------|--------|
| Frontend | Vercel | Optimisé Next.js, CDN global |
| Backend | Railway / Render | Support NestJS, CRON natif |
| Base de données | Back4App | Déjà configuré |

### Déploiement Vercel (Frontend)

```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
cd frontend
vercel --prod
```

### Déploiement Railway (Backend)

```bash
# Via Railway CLI ou GitHub integration
railway login
railway up
```

---

## 📚 Documentation API

Documentation complète disponible dans `/docs/API.md`

### Endpoints principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/appels-offres` | Liste des appels d'offres |
| GET | `/api/appels-offres/:id` | Détail d'un appel d'offre |
| POST | `/api/favoris` | Ajouter aux favoris |
| POST | `/api/alertes` | Configurer une alerte |
| POST | `/api/scraping/trigger` | Déclencher un scraping manuel |

---

## 🔒 Sécurité

- ✅ Clés API en variables d'environnement uniquement
- ✅ Règles ACL Parse Server configurées
- ✅ Validation des entrées côté serveur
- ✅ Rate limiting sur les endpoints sensibles
- ✅ CORS configuré strictement

---

## 📞 Support

Pour toute question technique :
- 📧 Email : support@pmn.sn
- 📱 Téléphone : +221 XX XXX XX XX

---

## 📄 Licence

Ce projet est la propriété du **Projet Mobilier National du Sénégal**.
Tous droits réservés © 2026
