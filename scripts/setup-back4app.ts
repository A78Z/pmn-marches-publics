/**
 * Script de configuration initiale de Back4App
 * 
 * Ce script crée les classes (tables) nécessaires et configure les ACL
 * 
 * Exécution: npx ts-node scripts/setup-back4app.ts
 */

import Parse from 'parse/node';

// Configuration - À NE PAS COMMITER AVEC LES VRAIES CLÉS
const config = {
  applicationId: process.env.PARSE_APPLICATION_ID || 'LPGia353sTNv27iiJhfNstJRatmA3GXEtXWkSjAn',
  javascriptKey: process.env.PARSE_JAVASCRIPT_KEY || 'FvYYaiCL694h5eu0CLpji4f6E00LMqIr7DNQqyZw',
  masterKey: process.env.PARSE_MASTER_KEY || 'nv8QYZ7DJ5xytIcM75D1iVSXTFtOhIswfefnbmcL',
  serverUrl: process.env.PARSE_SERVER_URL || 'https://parseapi.back4app.com',
};

// Initialiser Parse
Parse.initialize(config.applicationId, config.javascriptKey, config.masterKey);
(Parse as any).serverURL = config.serverUrl;

async function createSchema(className: string, fields: Record<string, any>) {
  console.log(`📦 Création du schéma: ${className}`);
  
  const schema = new Parse.Schema(className);
  
  for (const [fieldName, fieldConfig] of Object.entries(fields)) {
    const { type, ...options } = fieldConfig;
    
    switch (type) {
      case 'String':
        schema.addString(fieldName, options);
        break;
      case 'Number':
        schema.addNumber(fieldName, options);
        break;
      case 'Boolean':
        schema.addBoolean(fieldName, options);
        break;
      case 'Date':
        schema.addDate(fieldName, options);
        break;
      case 'Array':
        schema.addArray(fieldName, options);
        break;
      case 'Object':
        schema.addObject(fieldName, options);
        break;
      case 'Pointer':
        schema.addPointer(fieldName, options.targetClass, options);
        break;
      case 'Relation':
        schema.addRelation(fieldName, options.targetClass);
        break;
    }
  }
  
  try {
    await schema.save();
    console.log(`✅ Schéma ${className} créé`);
  } catch (error: any) {
    if (error.code === 103) {
      console.log(`ℹ️  Schéma ${className} existe déjà, mise à jour...`);
      await schema.update();
      console.log(`✅ Schéma ${className} mis à jour`);
    } else {
      throw error;
    }
  }
}

async function createRole(roleName: string) {
  console.log(`👥 Création du rôle: ${roleName}`);
  
  const roleQuery = new Parse.Query(Parse.Role);
  roleQuery.equalTo('name', roleName);
  
  let role = await roleQuery.first({ useMasterKey: true });
  
  if (!role) {
    const roleACL = new Parse.ACL();
    roleACL.setPublicReadAccess(true);
    roleACL.setPublicWriteAccess(false);
    
    role = new Parse.Role(roleName, roleACL);
    await role.save(null, { useMasterKey: true });
    console.log(`✅ Rôle ${roleName} créé`);
  } else {
    console.log(`ℹ️  Rôle ${roleName} existe déjà`);
  }
  
  return role;
}

async function createConfigurations() {
  console.log(`⚙️  Création des configurations initiales`);
  
  const configs = [
    { cle: 'scraping.actif', valeur: true, type: 'boolean', description: 'Active/désactive le scraping automatique' },
    { cle: 'scraping.cron', valeur: '0 6,12,18 * * *', type: 'string', description: 'Schedule CRON du scraping' },
    { cle: 'app.maintenance', valeur: false, type: 'boolean', description: 'Mode maintenance' },
    { cle: 'app.version', valeur: '1.0.0', type: 'string', description: 'Version de l\'application' },
  ];
  
  const Configuration = Parse.Object.extend('Configuration');
  
  for (const cfg of configs) {
    const query = new Parse.Query(Configuration);
    query.equalTo('cle', cfg.cle);
    
    let config = await query.first({ useMasterKey: true });
    
    if (!config) {
      config = new Configuration();
      config.set('cle', cfg.cle);
      config.set('valeur', cfg.valeur);
      config.set('type', cfg.type);
      config.set('description', cfg.description);
      
      // ACL admin uniquement
      const acl = new Parse.ACL();
      acl.setRoleReadAccess('admin', true);
      acl.setRoleWriteAccess('admin', true);
      config.setACL(acl);
      
      await config.save(null, { useMasterKey: true });
      console.log(`✅ Configuration ${cfg.cle} créée`);
    } else {
      console.log(`ℹ️  Configuration ${cfg.cle} existe déjà`);
    }
  }
}

async function main() {
  console.log('🚀 Démarrage de la configuration Back4App\n');
  
  try {
    // 1. Créer les rôles
    console.log('\n--- CRÉATION DES RÔLES ---');
    await createRole('admin');
    await createRole('artisan');
    
    // 2. Créer les schémas
    console.log('\n--- CRÉATION DES SCHÉMAS ---');
    
    // AppelOffre
    await createSchema('AppelOffre', {
      reference: { type: 'String', required: true },
      titre: { type: 'String', required: true },
      description: { type: 'String' },
      institution: { type: 'String', required: true },
      categorie: { type: 'String' },
      module: { type: 'String', required: true }, // entretiens | tenues | achats
      motsCles: { type: 'Array' },
      datePublication: { type: 'Date' },
      dateLimite: { type: 'Date', required: true },
      region: { type: 'String' },
      montant: { type: 'Number' },
      devise: { type: 'String', defaultValue: 'XOF' },
      urlSource: { type: 'String' },
      urlDossier: { type: 'String' },
      statut: { type: 'String', defaultValue: 'actif' },
      sourceHash: { type: 'String' },
      derniereSynchronisation: { type: 'Date' },
    });
    
    // Document
    await createSchema('Document', {
      appelOffre: { type: 'Pointer', targetClass: 'AppelOffre' },
      nom: { type: 'String', required: true },
      type: { type: 'String' }, // dao | cahier_charges | annexe | autre
      fichierUrl: { type: 'String' },
      urlExterne: { type: 'String' },
      taille: { type: 'Number' },
      format: { type: 'String' },
    });
    
    // Favori
    await createSchema('Favori', {
      artisan: { type: 'Pointer', targetClass: '_User' },
      appelOffre: { type: 'Pointer', targetClass: 'AppelOffre' },
      notes: { type: 'String' },
      rappel: { type: 'Date' },
    });
    
    // Historique
    await createSchema('Historique', {
      artisan: { type: 'Pointer', targetClass: '_User' },
      appelOffre: { type: 'Pointer', targetClass: 'AppelOffre' },
      dateConsultation: { type: 'Date' },
      dureeConsultation: { type: 'Number' },
      action: { type: 'String' }, // vue | telechargement | partage
    });
    
    // Alerte
    await createSchema('Alerte', {
      artisan: { type: 'Pointer', targetClass: '_User' },
      nom: { type: 'String', required: true },
      actif: { type: 'Boolean', defaultValue: true },
      modules: { type: 'Array' },
      regions: { type: 'Array' },
      motsCles: { type: 'Array' },
      montantMin: { type: 'Number' },
      montantMax: { type: 'Number' },
      email: { type: 'Boolean', defaultValue: true },
      whatsapp: { type: 'Boolean', defaultValue: false },
      push: { type: 'Boolean', defaultValue: false },
      frequence: { type: 'String', defaultValue: 'instantanee' },
      heureEnvoi: { type: 'String' },
      nombreEnvois: { type: 'Number', defaultValue: 0 },
      dernierEnvoi: { type: 'Date' },
    });
    
    // NotificationLog
    await createSchema('NotificationLog', {
      artisan: { type: 'Pointer', targetClass: '_User' },
      alerte: { type: 'Pointer', targetClass: 'Alerte' },
      appelOffre: { type: 'Pointer', targetClass: 'AppelOffre' },
      type: { type: 'String' }, // email | whatsapp | push
      statut: { type: 'String' }, // envoye | echec | en_attente
      destinataire: { type: 'String' },
      sujet: { type: 'String' },
      contenu: { type: 'String' },
      erreur: { type: 'String' },
    });
    
    // ScrapingLog
    await createSchema('ScrapingLog', {
      sessionId: { type: 'String', required: true },
      statut: { type: 'String' }, // succes | partiel | echec
      dateDebut: { type: 'Date' },
      dateFin: { type: 'Date' },
      dureeMs: { type: 'Number' },
      pagesScrapees: { type: 'Number' },
      nouveauxAppels: { type: 'Number' },
      appelsModifies: { type: 'Number' },
      erreurs: { type: 'Number' },
      logs: { type: 'Array' },
      changementsStructure: { type: 'Array' },
    });
    
    // Configuration
    await createSchema('Configuration', {
      cle: { type: 'String', required: true },
      valeur: { type: 'Object' },
      type: { type: 'String' },
      description: { type: 'String' },
    });
    
    // 3. Créer les configurations initiales
    console.log('\n--- CRÉATION DES CONFIGURATIONS ---');
    await createConfigurations();
    
    console.log('\n✅ Configuration Back4App terminée avec succès!');
    console.log('\nProchaines étapes:');
    console.log('1. Configurer les Class Level Permissions (CLP) dans le dashboard Back4App');
    console.log('2. Créer un utilisateur admin via l\'API ou le dashboard');
    console.log('3. Démarrer le backend pour activer le scraping');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  }
}

main();
