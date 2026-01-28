# 🚀 Guide de Déploiement - PMN Marchés Publics

## Architecture de déploiement recommandée

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │   Vercel     │    │   Railway    │    │     Back4App         │  │
│  │  (Frontend)  │    │  (Backend)   │    │   (Parse Server)     │  │
│  │              │    │              │    │                      │  │
│  │  Next.js 15  │◄──►│  NestJS      │◄──►│  MongoDB + Parse     │  │
│  │  SSR + Edge  │    │  Playwright  │    │  File Storage        │  │
│  │  CDN Global  │    │  CRON Jobs   │    │  Cloud Functions     │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 1. Prérequis

### Comptes nécessaires
- [ ] Compte [Vercel](https://vercel.com) (gratuit)
- [ ] Compte [Railway](https://railway.app) (à partir de $5/mois)
- [ ] Compte [Back4App](https://back4app.com) (gratuit pour démarrer)

### Outils locaux
```bash
# Vercel CLI
npm i -g vercel

# Railway CLI
npm i -g @railway/cli
```

## 2. Configuration Back4App

### 2.1 Création de l'application

1. Connectez-vous à [Back4App Dashboard](https://dashboard.back4app.com)
2. Cliquez sur "Create new App"
3. Nommez votre application : `pmn-marches-publics`
4. Notez les clés API générées

### 2.2 Configuration des schémas

Exécutez le script de setup :

```bash
# Depuis la racine du projet
export PARSE_APPLICATION_ID="votre_app_id"
export PARSE_JAVASCRIPT_KEY="votre_js_key"
export PARSE_MASTER_KEY="votre_master_key"
export PARSE_SERVER_URL="https://parseapi.back4app.com"

npm run setup:back4app
```

### 2.3 Configuration des Class-Level Permissions (CLP)

Dans le dashboard Back4App, configurez les CLP pour chaque classe :

| Classe | Public Read | Public Write | Authenticated Read | Authenticated Write |
|--------|-------------|--------------|-------------------|---------------------|
| AppelOffre | ✅ | ❌ | ✅ | ❌ |
| Document | ✅ | ❌ | ✅ | ❌ |
| Favori | ❌ | ❌ | ✅ (owner) | ✅ (owner) |
| Historique | ❌ | ❌ | ✅ (owner) | ✅ (owner) |
| Alerte | ❌ | ❌ | ✅ (owner) | ✅ (owner) |
| ScrapingLog | ❌ | ❌ | ❌ | ❌ |
| Configuration | ❌ | ❌ | ❌ | ❌ |

### 2.4 Création d'un administrateur

Via le dashboard Back4App :
1. Allez dans "Database" > "_User"
2. Créez un nouvel utilisateur avec :
   - `role`: "admin"
   - `estVerifie`: true

## 3. Déploiement Frontend (Vercel)

### 3.1 Configuration

Créez un fichier `vercel.json` à la racine du frontend :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["cdg1"],
  "env": {
    "NEXT_PUBLIC_PARSE_APPLICATION_ID": "@parse-app-id",
    "NEXT_PUBLIC_PARSE_JAVASCRIPT_KEY": "@parse-js-key",
    "NEXT_PUBLIC_PARSE_SERVER_URL": "@parse-server-url"
  }
}
```

### 3.2 Déploiement

```bash
cd frontend

# Connexion
vercel login

# Lier au projet (première fois)
vercel link

# Configurer les variables d'environnement
vercel env add NEXT_PUBLIC_PARSE_APPLICATION_ID
vercel env add NEXT_PUBLIC_PARSE_JAVASCRIPT_KEY
vercel env add NEXT_PUBLIC_PARSE_SERVER_URL

# Déployer en production
vercel --prod
```

### 3.3 Configuration du domaine

1. Dans le dashboard Vercel, allez dans Settings > Domains
2. Ajoutez votre domaine : `pmn-marches.sn`
3. Configurez les DNS selon les instructions

## 4. Déploiement Backend (Railway)

### 4.1 Configuration

Créez un fichier `railway.json` à la racine du backend :

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "healthcheckPath": "/api/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### 4.2 Variables d'environnement Railway

```bash
# Parse Server
PARSE_APPLICATION_ID=xxx
PARSE_JAVASCRIPT_KEY=xxx
PARSE_MASTER_KEY=xxx
PARSE_REST_API_KEY=xxx
PARSE_SERVER_URL=https://parseapi.back4app.com

# Application
PORT=3001
NODE_ENV=production
CORS_ORIGINS=https://pmn-marches.sn

# Scraping
SCRAPING_CRON_SCHEDULE="0 6,12,18 * * *"
SCRAPING_USER_AGENT="PMN-Scraper/1.0"
SCRAPING_TIMEOUT=30000

# Email (optionnel)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=xxx
EMAIL_FROM_NAME="PMN Marchés Publics"
EMAIL_FROM_ADDRESS=noreply@pmn-marches.sn

# WhatsApp (optionnel)
WHATSAPP_PHONE_NUMBER_ID=xxx
WHATSAPP_ACCESS_TOKEN=xxx
```

### 4.3 Déploiement

```bash
cd backend

# Connexion
railway login

# Initialiser le projet
railway init

# Déployer
railway up

# Voir les logs
railway logs
```

### 4.4 Installation de Playwright

Railway nécessite une configuration spéciale pour Playwright. Ajoutez dans `package.json` :

```json
{
  "scripts": {
    "postinstall": "npx playwright install chromium --with-deps"
  }
}
```

Ou utilisez un `nixpacks.toml` :

```toml
[phases.install]
cmds = ["npm ci", "npx playwright install chromium --with-deps"]
```

## 5. Monitoring et Logs

### 5.1 Vercel Analytics

Activez Vercel Analytics dans le dashboard pour suivre :
- Performance des pages
- Core Web Vitals
- Erreurs client

### 5.2 Railway Logs

```bash
# Logs en temps réel
railway logs -f

# Logs des dernières 24h
railway logs --since 24h
```

### 5.3 Alertes

Configurez des alertes dans Railway pour :
- CPU > 80%
- Mémoire > 90%
- Erreurs de scraping

## 6. Maintenance

### 6.1 Mise à jour

```bash
# Frontend
cd frontend
vercel --prod

# Backend
cd backend
railway up
```

### 6.2 Rollback

```bash
# Vercel - revenir à un déploiement précédent
vercel rollback

# Railway - utiliser le dashboard
```

### 6.3 Sauvegarde

Back4App effectue des sauvegardes automatiques. Pour une sauvegarde manuelle :

1. Dashboard Back4App > App Settings > General
2. Click "Export App"

## 7. Checklist de production

### Avant le lancement

- [ ] Variables d'environnement configurées
- [ ] HTTPS activé sur tous les services
- [ ] CORS configuré correctement
- [ ] Rate limiting activé
- [ ] Logs configurés
- [ ] Alertes configurées
- [ ] Sauvegardes automatiques vérifiées
- [ ] Tests de charge effectués

### Après le lancement

- [ ] Vérifier le scraping automatique
- [ ] Tester l'envoi de notifications
- [ ] Monitorer les performances
- [ ] Vérifier les logs d'erreurs

## 8. Coûts estimés

| Service | Plan | Coût mensuel |
|---------|------|--------------|
| Vercel | Pro | $20 |
| Railway | Starter | $5-20 |
| Back4App | Build | Gratuit - $25 |
| Domaine (.sn) | - | ~$30/an |
| **Total** | - | **~$50-70/mois** |

## 9. Support

Pour toute question :
- Documentation Vercel : https://vercel.com/docs
- Documentation Railway : https://docs.railway.app
- Documentation Back4App : https://www.back4app.com/docs
