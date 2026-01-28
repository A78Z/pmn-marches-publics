'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ExternalLink,
  FileDown,
  Share2,
  Check,
  AlertCircle,
  Heart,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TenderActionsProps {
  /** Fichier DAO hébergé sur PMN/Back4App (téléchargement direct possible) */
  daoFile?: string;
  /** URL du DAO sur le site source (peut être bloqué) */
  daoSourceUrl?: string;
  /** URL de la page de l'appel d'offres sur le portail officiel */
  urlSource: string;
  /** Titre de l'appel d'offres */
  tenderTitle: string;
  /** Référence de l'appel d'offres */
  tenderReference: string;
}

export function TenderActions({
  daoFile,
  daoSourceUrl,
  urlSource,
  tenderTitle,
  tenderReference,
}: TenderActionsProps) {
  const [copied, setCopied] = useState(false);

  /**
   * Vérifie si le DAO est disponible en téléchargement direct sur PMN
   */
  const hasPmnHostedDao = Boolean(daoFile);

  /**
   * Télécharger / Ouvrir le DAO
   * Priorité : fichier PMN > message informatif vers portail officiel
   */
  const handleDownloadDAO = () => {
    // ✅ CAS 1: DAO hébergé sur PMN/Back4App → Téléchargement direct
    if (daoFile) {
      const newWindow = window.open(daoFile, '_blank', 'noopener,noreferrer');
      
      if (newWindow) {
        toast.success('Téléchargement du DAO en cours...', {
          description: 'Le document s\'ouvre dans un nouvel onglet.',
          duration: 3000,
        });
      } else {
        // Fallback si popup bloqué
        toast.info('Cliquez pour télécharger le DAO', {
          description: 'Votre navigateur a bloqué l\'ouverture automatique.',
          action: {
            label: 'Télécharger',
            onClick: () => {
              const link = document.createElement('a');
              link.href = daoFile;
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
              link.download = `DAO-${tenderReference}.pdf`;
              link.click();
            },
          },
          duration: 10000,
        });
      }
      return;
    }

    // ⚠️ CAS 2: DAO non hébergé sur PMN → Redirection vers portail officiel
    toast.info(
      'Le DAO doit être téléchargé depuis le portail officiel des marchés publics.',
      {
        description: 'PMN ne peut pas héberger ce document. Accédez au portail officiel pour le télécharger.',
        action: urlSource ? {
          label: 'Accéder au portail officiel',
          onClick: () => handleViewSource(),
        } : undefined,
        duration: 8000,
      }
    );
  };

  /**
   * Ouvrir le lien source (marchespublics.sn)
   */
  const handleViewSource = () => {
    if (!urlSource) {
      toast.error('Le lien vers le portail officiel n\'est pas disponible.');
      return;
    }

    const newWindow = window.open(urlSource, '_blank', 'noopener,noreferrer');
    
    if (!newWindow) {
      toast.error('Impossible d\'ouvrir le lien.', {
        action: {
          label: 'Réessayer',
          onClick: () => {
            const link = document.createElement('a');
            link.href = urlSource;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.click();
          },
        },
      });
    }
  };

  /**
   * Partager l'appel d'offres
   */
  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: `Appel d'offres ${tenderReference}`,
      text: tenderTitle,
      url: shareUrl,
    };

    try {
      // Vérifier si l'API de partage est disponible
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('Partagé avec succès !');
      } else {
        // Fallback : copier le lien
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Lien copié dans le presse-papiers !');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      // Si l'utilisateur annule le partage, ne pas afficher d'erreur
      if ((error as Error).name !== 'AbortError') {
        // Fallback : copier le lien
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          toast.success('Lien copié dans le presse-papiers !');
          setTimeout(() => setCopied(false), 2000);
        } catch {
          toast.error('Impossible de partager');
        }
      }
    }
  };

  // Détermine le type de bouton DAO à afficher
  const getDaoButtonState = () => {
    if (hasPmnHostedDao) {
      // DAO disponible sur PMN → téléchargement direct
      return { 
        variant: 'default' as const, 
        icon: FileDown, 
        text: 'Télécharger le DAO',
        subtitle: 'Téléchargement direct'
      };
    }
    // DAO non disponible sur PMN → redirection vers portail
    return { 
      variant: 'secondary' as const, 
      icon: ExternalLink, 
      text: 'Télécharger le DAO',
      subtitle: 'Via le portail officiel'
    };
  };

  const daoButton = getDaoButtonState();

  return (
    <div className="space-y-3">
      {/* Télécharger le DAO - TOUJOURS un bouton cliquable */}
      <Button 
        className="w-full gap-2 h-auto py-3" 
        size="lg" 
        variant={daoButton.variant}
        onClick={handleDownloadDAO}
      >
        <daoButton.icon className="w-5 h-5 flex-shrink-0" />
        <div className="flex flex-col items-start text-left">
          <span>{daoButton.text}</span>
          <span className="text-xs opacity-70 font-normal">{daoButton.subtitle}</span>
        </div>
      </Button>

      {/* Voir sur marchespublics.sn */}
      <Button 
        variant="outline" 
        className="w-full gap-2" 
        onClick={handleViewSource}
        disabled={!urlSource}
      >
        <ExternalLink className="w-5 h-5" />
        Voir sur marchespublics.sn
      </Button>

      {/* Partager */}
      <Button variant="ghost" className="w-full gap-2" onClick={handleShare}>
        {copied ? (
          <>
            <Check className="w-5 h-5 text-green-500" />
            Lien copié !
          </>
        ) : (
          <>
            <Share2 className="w-5 h-5" />
            Partager
          </>
        )}
      </Button>
    </div>
  );
}

interface KeywordTagsProps {
  keywords: string[];
}

export function KeywordTags({ keywords }: KeywordTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword) => (
        <Link
          key={keyword}
          href={`/appels-offres?q=${encodeURIComponent(keyword)}`}
          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer"
        >
          {keyword}
        </Link>
      ))}
    </div>
  );
}

interface InstitutionCardActionsProps {
  institution: string;
}

export function InstitutionCardActions({ institution }: InstitutionCardActionsProps) {
  return (
    <Button variant="outline" size="sm" className="w-full" asChild>
      <Link href={`/appels-offres?q=${encodeURIComponent(institution)}`}>
        Voir tous leurs appels d&apos;offres
      </Link>
    </Button>
  );
}

interface HeaderActionsProps {
  tenderReference: string;
}

export function HeaderActions({ tenderReference }: HeaderActionsProps) {
  const handleFavorite = () => {
    toast.info(
      'Fonctionnalité bientôt disponible ! Consultez régulièrement la plateforme pour suivre vos appels d\'offres.',
      { duration: 4000 }
    );
  };

  const handleAlert = () => {
    toast.info(
      'Les alertes personnalisées seront bientôt disponibles. En attendant, consultez régulièrement les nouveaux appels d\'offres.',
      { duration: 4000 }
    );
  };

  return (
    <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
      <Button variant="secondary" size="lg" className="gap-2" onClick={handleFavorite}>
        <Heart className="w-5 h-5" />
        Ajouter aux favoris
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="gap-2 border-white/30 text-white hover:bg-white/10"
        onClick={handleAlert}
      >
        <Bell className="w-5 h-5" />
        Créer une alerte
      </Button>
    </div>
  );
}
