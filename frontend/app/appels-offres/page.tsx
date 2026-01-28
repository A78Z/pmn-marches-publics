import { Suspense } from 'react';
import { Metadata } from 'next';
import { TendersList } from '@/components/tenders/tenders-list';
import { TendersFilters } from '@/components/tenders/tenders-filters';
import { TendersHeader } from '@/components/tenders/tenders-header';
import { TendersLoading } from '@/components/tenders/tenders-loading';

export const metadata: Metadata = {
  title: 'Appels d\'offres',
  description: 'Consultez tous les appels d\'offres publics du Sénégal. Filtrez par module, région, date limite et trouvez les opportunités qui correspondent à votre activité.',
};

interface PageProps {
  searchParams: {
    q?: string;
    module?: string;
    region?: string;
    statut?: string;
    page?: string;
  };
}

export default function AppelsOffresPage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <TendersHeader />

      {/* Main content */}
      <div className="container-pmn py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <TendersFilters />
          </aside>

          {/* Tenders list */}
          <main className="flex-1">
            <Suspense fallback={<TendersLoading />}>
              <TendersList searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
