import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-SN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(d);
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-SN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function formatCurrency(amount: number, currency: string = 'XOF'): string {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-SN').format(num);
}

export function getDaysUntil(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getDeadlineStatus(dateLimite: Date | string): 'urgent' | 'actif' | 'expire' {
  const days = getDaysUntil(dateLimite);
  if (days < 0) return 'expire';
  if (days <= 7) return 'urgent';
  return 'actif';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getModuleColor(module: string): string {
  const colors: Record<string, string> = {
    entretiens: '#10B981',
    tenues: '#6366F1',
    achats: '#F59E0B',
    vehicules: '#3B82F6',
    chaussures_maroquinerie: '#8B5CF6',
    equipements_militaires: '#64748B',
    mobilier_hospitalier: '#EC4899',
    textiles_professionnels: '#F97316',
    btp: '#EAB308',
    fabrication_metallique: '#78716C',
    maintenance_industrielle: '#0EA5E9',
    equipements_agricoles: '#22C55E',
  };
  return colors[module] || '#6B7280';
}

export function getModuleIcon(module: string): string {
  const icons: Record<string, string> = {
    entretiens: '🧹',
    tenues: '👔',
    achats: '🪑',
    vehicules: '🚗',
    chaussures_maroquinerie: '👞',
    equipements_militaires: '🛡️',
    mobilier_hospitalier: '🏥',
    textiles_professionnels: '🦺',
    btp: '🏗️',
    fabrication_metallique: '🔩',
    maintenance_industrielle: '⚙️',
    equipements_agricoles: '🚜',
  };
  return icons[module] || '📄';
}

export function getModuleLabel(module: string): string {
  const labels: Record<string, string> = {
    entretiens: 'Entretiens',
    tenues: 'Tenues',
    achats: 'Achats',
    vehicules: 'Véhicules et Maintenance Auto',
    chaussures_maroquinerie: 'Chaussures et Maroquinerie',
    equipements_militaires: 'Équipements Militaires',
    mobilier_hospitalier: 'Mobilier Hospitalier',
    textiles_professionnels: 'Textiles Professionnels',
    btp: 'BTP',
    fabrication_metallique: 'Fabrication Métallique',
    maintenance_industrielle: 'Maintenance Industrielle',
    equipements_agricoles: 'Équipements Agricoles',
  };
  return labels[module] || module;
}

export const REGIONS_SENEGAL = [
  'Dakar',
  'Diourbel',
  'Fatick',
  'Kaffrine',
  'Kaolack',
  'Kédougou',
  'Kolda',
  'Louga',
  'Matam',
  'Saint-Louis',
  'Sédhiou',
  'Tambacounda',
  'Thiès',
  'Ziguinchor',
  'National',
] as const;

export type Region = (typeof REGIONS_SENEGAL)[number];

export const MODULES_PMN = {
  entretiens: {
    id: 'entretiens',
    nom: 'Entretiens',
    description: 'Nettoyage, maintenance, gardiennage',
    icone: '🧹',
    couleur: '#10B981',
  },
  tenues: {
    id: 'tenues',
    nom: 'Tenues',
    description: 'Uniformes, habillement, textile, couture',
    icone: '👔',
    couleur: '#6366F1',
  },
  achats: {
    id: 'achats',
    nom: 'Achats',
    description: 'Mobilier, équipements, fournitures',
    icone: '🪑',
    couleur: '#F59E0B',
  },
  vehicules: {
    id: 'vehicules',
    nom: 'Véhicules et Maintenance Automobile',
    description: 'Véhicules, pièces détachées, entretien automobile',
    icone: '🚗',
    couleur: '#3B82F6',
  },
  chaussures_maroquinerie: {
    id: 'chaussures_maroquinerie',
    nom: 'Chaussures, Maroquinerie et Articles en cuir',
    description: 'Chaussures, sacs, ceintures, articles en cuir',
    icone: '👞',
    couleur: '#8B5CF6',
  },
  equipements_militaires: {
    id: 'equipements_militaires',
    nom: 'Équipements militaires et de sécurité',
    description: 'Équipements défense, sécurité, protection',
    icone: '🛡️',
    couleur: '#64748B',
  },
  mobilier_hospitalier: {
    id: 'mobilier_hospitalier',
    nom: 'Mobilier et Équipements Hospitaliers',
    description: 'Mobilier médical, équipements de santé',
    icone: '🏥',
    couleur: '#EC4899',
  },
  textiles_professionnels: {
    id: 'textiles_professionnels',
    nom: 'Textiles professionnels et vêtements de travail',
    description: 'Vêtements de travail, EPI textiles, linge professionnel',
    icone: '🦺',
    couleur: '#F97316',
  },
  btp: {
    id: 'btp',
    nom: 'Bâtiment et Travaux Publics',
    description: 'Construction, génie civil, travaux publics',
    icone: '🏗️',
    couleur: '#EAB308',
  },
  fabrication_metallique: {
    id: 'fabrication_metallique',
    nom: 'Fabrication métallique et structures',
    description: 'Métallurgie, charpentes, structures métalliques',
    icone: '🔩',
    couleur: '#78716C',
  },
  maintenance_industrielle: {
    id: 'maintenance_industrielle',
    nom: 'Maintenance industrielle et technique',
    description: 'Maintenance machines, équipements industriels',
    icone: '⚙️',
    couleur: '#0EA5E9',
  },
  equipements_agricoles: {
    id: 'equipements_agricoles',
    nom: 'Équipements agricoles et agro-industriels',
    description: 'Machines agricoles, équipements agro-industrie',
    icone: '🚜',
    couleur: '#22C55E',
  },
} as const;

export type ModulePMN = keyof typeof MODULES_PMN;
