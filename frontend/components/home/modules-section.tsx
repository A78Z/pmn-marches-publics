'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Liste des 12 modules métiers PMN
 * Structure compatible avec le design existant des cartes
 */
const modules = [
  // ══════════════════════════════════════════════════════════════════
  // MODULES HISTORIQUES (3)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'entretiens',
    name: 'Entretiens',
    description:
      'Services de nettoyage, maintenance des bâtiments, gardiennage, espaces verts et services d\'entretien divers.',
    emoji: '🧹',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    examples: ['Nettoyage', 'Gardiennage', 'Maintenance', 'Espaces verts'],
    count: 847,
  },
  {
    id: 'tenues',
    name: 'Tenues',
    description:
      'Confection d\'uniformes, tenues de travail, vêtements professionnels, textile et services de couture.',
    emoji: '👔',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    textColor: 'text-indigo-700 dark:text-indigo-400',
    examples: ['Uniformes', 'Tenues de travail', 'Textile', 'Couture'],
    count: 523,
  },
  {
    id: 'achats',
    name: 'Achats',
    description:
      'Fourniture de mobilier de bureau, équipements, matériel informatique et fournitures diverses.',
    emoji: '🪑',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-400',
    examples: ['Mobilier', 'Équipements', 'Fournitures', 'Informatique'],
    count: 1130,
  },
  // ══════════════════════════════════════════════════════════════════
  // NOUVEAUX MODULES (9)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'vehicules',
    name: 'Véhicules et Maintenance Auto',
    description:
      'Acquisition, entretien et réparation de véhicules, pièces détachées, pneumatiques et services de garage.',
    emoji: '🚗',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-400',
    examples: ['Véhicules', 'Maintenance', 'Pièces détachées', 'Garage'],
    count: 312,
  },
  {
    id: 'chaussures_maroquinerie',
    name: 'Chaussures et Maroquinerie',
    description:
      'Chaussures professionnelles, articles en cuir, sacs, ceintures et accessoires de maroquinerie.',
    emoji: '👞',
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-50 dark:bg-violet-950/20',
    borderColor: 'border-violet-200 dark:border-violet-800',
    textColor: 'text-violet-700 dark:text-violet-400',
    examples: ['Chaussures sécurité', 'Sacs', 'Cuir', 'Maroquinerie'],
    count: 89,
  },
  {
    id: 'equipements_militaires',
    name: 'Équipements Militaires',
    description:
      'Matériel de défense, équipements de sécurité, protection individuelle et systèmes de surveillance.',
    emoji: '🛡️',
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50 dark:bg-slate-950/20',
    borderColor: 'border-slate-200 dark:border-slate-800',
    textColor: 'text-slate-700 dark:text-slate-400',
    examples: ['Protection', 'Sécurité', 'Surveillance', 'Défense'],
    count: 156,
  },
  {
    id: 'mobilier_hospitalier',
    name: 'Mobilier Hospitalier',
    description:
      'Lits médicalisés, équipements de santé, instruments médicaux et mobilier pour établissements de santé.',
    emoji: '🏥',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-950/20',
    borderColor: 'border-pink-200 dark:border-pink-800',
    textColor: 'text-pink-700 dark:text-pink-400',
    examples: ['Lits médicaux', 'Équipements', 'Instruments', 'Mobilier santé'],
    count: 234,
  },
  {
    id: 'textiles_professionnels',
    name: 'Textiles Professionnels',
    description:
      'Vêtements de travail, équipements de protection individuelle textiles, linge professionnel.',
    emoji: '🦺',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-700 dark:text-orange-400',
    examples: ['EPI', 'Blouses', 'Haute visibilité', 'Linge pro'],
    count: 178,
  },
  {
    id: 'btp',
    name: 'Bâtiment et Travaux Publics',
    description:
      'Construction, rénovation, réhabilitation, génie civil, travaux routiers et infrastructures.',
    emoji: '🏗️',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    examples: ['Construction', 'Rénovation', 'Génie civil', 'Voirie'],
    count: 567,
  },
  {
    id: 'fabrication_metallique',
    name: 'Fabrication Métallique',
    description:
      'Structures métalliques, charpentes, serrurerie, menuiserie métallique et ouvrages en acier.',
    emoji: '🔩',
    color: 'from-stone-500 to-stone-600',
    bgColor: 'bg-stone-50 dark:bg-stone-950/20',
    borderColor: 'border-stone-200 dark:border-stone-800',
    textColor: 'text-stone-700 dark:text-stone-400',
    examples: ['Charpentes', 'Serrurerie', 'Portails', 'Structures'],
    count: 145,
  },
  {
    id: 'maintenance_industrielle',
    name: 'Maintenance Industrielle',
    description:
      'Entretien et réparation de machines industrielles, équipements techniques et installations.',
    emoji: '⚙️',
    color: 'from-sky-500 to-sky-600',
    bgColor: 'bg-sky-50 dark:bg-sky-950/20',
    borderColor: 'border-sky-200 dark:border-sky-800',
    textColor: 'text-sky-700 dark:text-sky-400',
    examples: ['Machines', 'Automatismes', 'Dépannage', 'Révision'],
    count: 98,
  },
  {
    id: 'equipements_agricoles',
    name: 'Équipements Agricoles',
    description:
      'Matériel agricole, tracteurs, équipements d\'irrigation, machines agro-industrielles.',
    emoji: '🚜',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-400',
    examples: ['Tracteurs', 'Irrigation', 'Machines', 'Agro-industrie'],
    count: 203,
  },
];

export function ModulesSection() {
  return (
    <section className="py-20">
      <div className="container-pmn">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Douze modules métiers pour{' '}
            <span className="gradient-text">votre activité</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Les appels d&apos;offres sont automatiquement classifiés selon votre domaine d&apos;expertise artisanale.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className={`h-full card-hover border-2 ${module.borderColor} ${module.bgColor} overflow-hidden`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-2xl">{module.emoji}</span>
                    </div>
                    <div className={`text-right`}>
                      <div className={`text-2xl font-bold ${module.textColor}`}>
                        {module.count}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        appels actifs
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{module.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {module.examples.map((example) => (
                      <span
                        key={example}
                        className="inline-flex items-center rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-medium"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full group"
                    asChild
                  >
                    <Link href={`/appels-offres?module=${module.id}`}>
                      Voir les appels d&apos;offres
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
