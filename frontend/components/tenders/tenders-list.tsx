'use client';

import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Calendar,
  MapPin,
  Building2,
  ArrowRight,
  Clock,
  ExternalLink,
  Heart,
  FileDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  formatDate,
  getDaysUntil,
  getDeadlineStatus,
  getModuleLabel,
  formatCurrency,
} from '@/lib/utils';
import { mockTenders } from '@/lib/mock-data';

interface TendersListProps {
  searchParams: {
    q?: string;
    module?: string;
    region?: string;
    statut?: string;
    page?: string;
  };
}

export function TendersList({ searchParams }: TendersListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentPage = parseInt(searchParams.page || '1', 10);

  // Filtrer les données mock selon les paramètres
  let filteredTenders = [...mockTenders];

  if (searchParams.module) {
    const modules = searchParams.module.split(',');
    filteredTenders = filteredTenders.filter((t) => modules.includes(t.module));
  }

  if (searchParams.region) {
    filteredTenders = filteredTenders.filter((t) => t.region === searchParams.region);
  }

  if (searchParams.q) {
    const query = searchParams.q.toLowerCase();
    filteredTenders = filteredTenders.filter(
      (t) =>
        t.titre.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.institution.toLowerCase().includes(query)
    );
  }

  const totalResults = filteredTenders.length;
  const totalPages = Math.ceil(totalResults / 6);

  // Pagination
  const paginatedTenders = filteredTenders.slice((currentPage - 1) * 6, currentPage * 6);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (filteredTenders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Aucun appel d&apos;offre trouvé</h3>
        <p className="text-muted-foreground mb-6">
          Essayez de modifier vos critères de recherche ou de supprimer certains filtres.
        </p>
        <Button variant="outline" onClick={() => router.push('/appels-offres')}>
          Voir tous les appels d&apos;offres
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{totalResults}</span> appel(s) d&apos;offre trouvé(s)
        </p>
      </div>

      {/* Tenders grid */}
      <div className="grid gap-6">
        {paginatedTenders.map((tender) => {
          const daysLeft = getDaysUntil(tender.dateLimite);
          const status = getDeadlineStatus(tender.dateLimite);

          return (
            <Card key={tender.id} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant={tender.module as keyof typeof import('@/lib/utils').MODULES_PMN}>
                        {getModuleLabel(tender.module)}
                      </Badge>
                      <Badge variant="outline" className="font-mono text-xs">
                        {tender.reference}
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
                      className="font-semibold text-lg leading-tight hover:text-primary transition-colors block"
                    >
                      {tender.titre}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {tender.description}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{tender.institution}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{tender.region}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{formatDate(tender.dateLimite)}</span>
                  </div>
                  {tender.montant && (
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <span>{formatCurrency(tender.montant)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t flex flex-col sm:flex-row justify-between gap-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Date limite : </span>
                  <span
                    className={`font-semibold ${
                      status === 'urgent'
                        ? 'text-red-600'
                        : status === 'actif'
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {daysLeft > 0 ? `${daysLeft} jour(s) restant(s)` : 'Expiré'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={tender.urlSource} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Source
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/appels-offres/${tender.id}`}>
                      Voir détails
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Précédent
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'outline'}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
