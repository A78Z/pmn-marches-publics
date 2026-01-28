import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Building2,
  Clock,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TenderActions,
  KeywordTags,
  InstitutionCardActions,
  HeaderActions,
} from '@/components/tenders/tender-actions';
import {
  formatDate,
  formatCurrency,
  getDaysUntil,
  getDeadlineStatus,
  getModuleLabel,
  getModuleIcon,
} from '@/lib/utils';
import { getTenderById } from '@/lib/mock-data';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Récupérer l'appel d'offres par son ID
  const tender = getTenderById(params.id);

  if (!tender) {
    return {
      title: 'Appel d\'offres non trouvé',
      description: 'L\'appel d\'offres demandé n\'existe pas ou a été supprimé.',
    };
  }

  return {
    title: tender.titre,
    description: `${tender.institution} - Date limite: ${formatDate(tender.dateLimite)}`,
    openGraph: {
      title: tender.titre,
      description: `Appel d'offres ${tender.reference} - ${tender.institution}`,
    },
  };
}

export default function TenderDetailPage({ params }: PageProps) {
  // Récupérer l'appel d'offres par son ID depuis les données
  const tender = getTenderById(params.id);

  if (!tender) {
    notFound();
  }

  const daysLeft = getDaysUntil(tender.dateLimite);
  const status = getDeadlineStatus(tender.dateLimite);

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pmn-green-600 to-pmn-green-700 text-white">
        <div className="container-pmn py-8">
          <Link
            href="/appels-offres"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux appels d&apos;offres
          </Link>

          <div className="flex flex-col lg:flex-row gap-6 justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge
                  variant={tender.module as keyof typeof import('@/lib/utils').MODULES_PMN}
                  className="text-sm"
                >
                  {getModuleIcon(tender.module)} {getModuleLabel(tender.module)}
                </Badge>
                <Badge variant="outline" className="bg-white/10 border-white/30 text-white">
                  {tender.reference}
                </Badge>
                {status === 'urgent' && (
                  <Badge variant="destructive" className="animate-pulse">
                    <Clock className="w-3 h-3 mr-1" />
                    Urgent - {daysLeft} jour(s)
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold mb-4">{tender.titre}</h1>

              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  <span>{tender.institution}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{tender.region}</span>
                </div>
              </div>
            </div>

            <HeaderActions tenderReference={tender.reference} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-pmn py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description de l&apos;appel d&apos;offres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-green dark:prose-invert max-w-none">
                  {tender.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mots-clés */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Mots-clés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <KeywordTags keywords={tender.motsCles} />
              </CardContent>
            </Card>

            {/* Guide de postulation */}
            <Card className="border-pmn-green-200 bg-pmn-green-50/50 dark:border-pmn-green-800 dark:bg-pmn-green-950/20">
              <CardHeader>
                <CardTitle className="text-pmn-green-700 dark:text-pmn-green-400">
                  📋 Comment postuler ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal list-inside space-y-3 text-sm">
                  <li>
                    <strong>Téléchargez le dossier d&apos;appel d&apos;offres (DAO)</strong> contenant le cahier des charges et les formulaires requis.
                  </li>
                  <li>
                    <strong>Préparez votre dossier de candidature</strong> avec tous les documents demandés (attestations fiscales, références, etc.).
                  </li>
                  <li>
                    <strong>Soumettez votre offre</strong> avant la date limite indiquée, selon les modalités précisées dans le DAO.
                  </li>
                  <li>
                    <strong>Suivez l&apos;avancement</strong> sur le portail officiel des marchés publics.
                  </li>
                </ol>

                <div className="pt-4 border-t border-pmn-green-200 dark:border-pmn-green-800">
                  <p className="text-sm text-muted-foreground mb-3">
                    Besoin d&apos;aide pour constituer votre dossier ?
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/guide">
                      Consulter le guide complet
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations clés */}
            <Card>
              <CardHeader>
                <CardTitle>Informations clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-muted-foreground">Statut</span>
                  <Badge
                    variant={status === 'urgent' ? 'destructive' : status === 'actif' ? 'success' : 'secondary'}
                  >
                    {status === 'urgent' ? 'Urgent' : status === 'actif' ? 'Actif' : 'Expiré'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-muted-foreground">Date limite</span>
                  <div className="text-right">
                    <div className="font-semibold">{formatDate(tender.dateLimite)}</div>
                    <div
                      className={`text-sm ${
                        status === 'urgent'
                          ? 'text-red-600'
                          : status === 'actif'
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {daysLeft > 0 ? `${daysLeft} jour(s) restant(s)` : 'Expiré'}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-muted-foreground">Publication</span>
                  <span className="font-medium">{formatDate(tender.datePublication)}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-muted-foreground">Région</span>
                  <span className="font-medium">{tender.region}</span>
                </div>

                {tender.montant && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Montant estimé</span>
                    <span className="font-semibold text-pmn-green-600">
                      {formatCurrency(tender.montant, tender.devise)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground">Catégorie</span>
                  <span className="font-medium">{tender.categorie}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Documents et liens</CardTitle>
              </CardHeader>
              <CardContent>
                <TenderActions
                  daoFile={tender.daoFile}
                  daoSourceUrl={tender.daoSourceUrl}
                  urlSource={tender.urlSource}
                  tenderTitle={tender.titre}
                  tenderReference={tender.reference}
                />
              </CardContent>
            </Card>

            {/* Institution */}
            <Card>
              <CardHeader>
                <CardTitle>Institution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">{tender.institution}</div>
                    <div className="text-sm text-muted-foreground">{tender.region}</div>
                  </div>
                </div>
                <InstitutionCardActions institution={tender.institution} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
