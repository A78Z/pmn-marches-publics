'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { REGIONS_SENEGAL, MODULES_PMN } from '@/lib/utils';

export function TendersFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === '') {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      // Reset to page 1 when filters change
      if (!params.hasOwnProperty('page')) {
        newSearchParams.delete('page');
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`${pathname}?${createQueryString({ q: search })}`);
  };

  const handleModuleChange = (module: string, checked: boolean) => {
    const currentModules = searchParams.get('module')?.split(',').filter(Boolean) || [];
    let newModules: string[];

    if (checked) {
      newModules = [...currentModules, module];
    } else {
      newModules = currentModules.filter((m) => m !== module);
    }

    router.push(
      `${pathname}?${createQueryString({
        module: newModules.length > 0 ? newModules.join(',') : null,
      })}`
    );
  };

  const handleRegionChange = (region: string) => {
    router.push(`${pathname}?${createQueryString({ region: region === 'all' ? null : region })}`);
  };

  const handleStatutChange = (statut: string) => {
    router.push(`${pathname}?${createQueryString({ statut: statut === 'all' ? null : statut })}`);
  };

  const clearFilters = () => {
    router.push(pathname);
    setSearch('');
  };

  const activeModule = searchParams.get('module');
  const activeRegion = searchParams.get('region');
  const activeStatut = searchParams.get('statut');
  const hasFilters = activeModule || activeRegion || activeStatut || searchParams.get('q');

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="w-4 h-4" />
            Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Mot-clé..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Modules */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Modules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(MODULES_PMN).map(([key, module]) => (
            <div key={key} className="flex items-center space-x-3">
              <Checkbox
                id={`module-${key}`}
                checked={activeModule?.split(',').includes(key) || false}
                onCheckedChange={(checked) =>
                  handleModuleChange(key, checked as boolean)
                }
              />
              <Label
                htmlFor={`module-${key}`}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <span>{module.icone}</span>
                <span>{module.nom}</span>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Région */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Région</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={activeRegion || 'all'} onValueChange={handleRegionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les régions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les régions</SelectItem>
              {REGIONS_SENEGAL.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Statut */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Statut</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={activeStatut || 'all'} onValueChange={handleStatutChange}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="actif">Actifs uniquement</SelectItem>
              <SelectItem value="expire">Expirés</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Clear filters */}
      {hasFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
        >
          <X className="w-4 h-4 mr-2" />
          Effacer les filtres
        </Button>
      )}
    </div>
  );
}
