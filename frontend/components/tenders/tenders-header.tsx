'use client';

import { useSearchParams } from 'next/navigation';
import { FileText, Filter } from 'lucide-react';
import { getModuleLabel } from '@/lib/utils';

export function TendersHeader() {
  const searchParams = useSearchParams();
  const module = searchParams.get('module');
  const search = searchParams.get('q');

  let title = 'Tous les appels d\'offres';
  let description = 'Consultez les opportunités de marchés publics au Sénégal';

  if (module) {
    title = `Appels d'offres - ${getModuleLabel(module)}`;
    description = `Marchés publics dans le domaine ${getModuleLabel(module).toLowerCase()}`;
  }

  if (search) {
    title = `Résultats pour "${search}"`;
    description = 'Appels d\'offres correspondant à votre recherche';
  }

  return (
    <div className="bg-gradient-to-r from-pmn-green-600 to-pmn-green-700 text-white">
      <div className="container-pmn py-12">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
            <p className="text-white/80">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
