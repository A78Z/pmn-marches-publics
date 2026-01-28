'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Building2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, getDaysUntil, getDeadlineStatus, getModuleLabel } from '@/lib/utils';

// Mock data - sera remplacé par les données réelles de Parse
const recentTenders = [
  {
    id: '1',
    reference: 'AO-2026-001234',
    titre: 'Marché de nettoyage et d\'entretien des locaux administratifs',
    institution: 'Ministère de l\'Éducation Nationale',
    module: 'entretiens',
    region: 'Dakar',
    datePublication: '2026-01-25',
    dateLimite: '2026-02-15',
    montant: 45000000,
  },
  {
    id: '17',
    reference: 'AO-2026-001250',
    titre: 'Construction de 3 écoles élémentaires dans la région de Kaolack',
    institution: 'Ministère de l\'Éducation Nationale',
    module: 'btp',
    region: 'Kaolack',
    datePublication: '2026-01-27',
    dateLimite: '2026-03-15',
    montant: 850000000,
  },
  {
    id: '7',
    reference: 'AO-2026-001240',
    titre: 'Acquisition de véhicules de service pour la Direction des Douanes',
    institution: 'Direction Générale des Douanes',
    module: 'vehicules',
    region: 'National',
    datePublication: '2026-01-26',
    dateLimite: '2026-02-25',
    montant: 450000000,
  },
  {
    id: '13',
    reference: 'AO-2026-001246',
    titre: 'Fourniture de lits médicalisés pour l\'Hôpital Régional de Thiès',
    institution: 'Ministère de la Santé et de l\'Action Sociale',
    module: 'mobilier_hospitalier',
    region: 'Thiès',
    datePublication: '2026-01-28',
    dateLimite: '2026-03-05',
    montant: 185000000,
  },
];

export function RecentTenders() {
  return (
    <section className="py-20">
      <div className="container-pmn">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Derniers appels d&apos;offres
            </h2>
            <p className="text-muted-foreground">
              Consultez les opportunités les plus récentes
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/appels-offres">
              Voir tous les appels
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {recentTenders.map((tender, index) => {
            const daysLeft = getDaysUntil(tender.dateLimite);
            const status = getDeadlineStatus(tender.dateLimite);

            return (
              <motion.div
                key={tender.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={tender.module as keyof typeof import('@/lib/utils').MODULES_PMN}
                          >
                            {getModuleLabel(tender.module)}
                          </Badge>
                          {status === 'urgent' && (
                            <Badge variant="destructive">
                              <Clock className="w-3 h-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <Link
                          href={`/appels-offres/${tender.id}`}
                          className="font-semibold text-lg leading-tight hover:text-primary transition-colors line-clamp-2"
                        >
                          {tender.titre}
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{tender.institution}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{tender.region}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>{formatDate(tender.dateLimite)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-3 border-t">
                    <div className="flex items-center justify-between w-full">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Reste </span>
                        <span
                          className={`font-semibold ${
                            status === 'urgent'
                              ? 'text-red-600'
                              : status === 'actif'
                              ? 'text-green-600'
                              : 'text-gray-500'
                          }`}
                        >
                          {daysLeft > 0 ? `${daysLeft} jours` : 'Expiré'}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/appels-offres/${tender.id}`}>
                          Voir détails
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
