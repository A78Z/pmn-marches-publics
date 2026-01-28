import { Metadata } from 'next';
import Link from 'next/link';
import {
  Search,
  Filter,
  FileText,
  Download,
  Send,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Comment ça marche | PMN Marchés Publics',
  description:
    'Guide complet pour consulter les appels d\'offres et postuler aux marchés publics du Sénégal via la plateforme PMN.',
};

const steps = [
  {
    number: '01',
    title: 'Rechercher un appel d\'offres',
    description:
      'Utilisez notre moteur de recherche pour trouver les appels d\'offres correspondant à votre domaine d\'activité. Filtrez par module métier, région ou institution.',
    icon: Search,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    number: '02',
    title: 'Filtrer par catégorie',
    description:
      'Affinez vos résultats grâce aux 12 modules métiers : Entretiens, Tenues, Achats, BTP, Véhicules, Équipements Agricoles, et bien d\'autres.',
    icon: Filter,
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  {
    number: '03',
    title: 'Consulter les détails',
    description:
      'Accédez aux informations complètes de chaque appel d\'offres : description, dates limites, montant estimé, institution concernée et documents requis.',
    icon: FileText,
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    number: '04',
    title: 'Télécharger le dossier',
    description:
      'Téléchargez le Dossier d\'Appel d\'Offres (DAO) contenant le cahier des charges, les formulaires de soumission et toutes les pièces nécessaires.',
    icon: Download,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    number: '05',
    title: 'Préparer votre candidature',
    description:
      'Constituez votre dossier de réponse en suivant les instructions du DAO. Rassemblez attestations fiscales, références et documents administratifs.',
    icon: Send,
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  },
  {
    number: '06',
    title: 'Soumettre votre offre',
    description:
      'Déposez votre offre via le portail officiel marchespublics.sn avant la date limite. Respectez les modalités de soumission indiquées.',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
];

const tips = [
  {
    title: 'Anticipez les délais',
    description: 'Les dates limites sont strictes. Commencez à préparer votre dossier dès la publication de l\'appel.',
  },
  {
    title: 'Vérifiez votre éligibilité',
    description: 'Assurez-vous de répondre aux critères de sélection avant de constituer votre dossier.',
  },
  {
    title: 'Complétude du dossier',
    description: 'Un dossier incomplet est systématiquement rejeté. Vérifiez chaque pièce demandée.',
  },
  {
    title: 'Mises à jour régulières',
    description: 'Consultez régulièrement la plateforme. De nouveaux appels sont publiés quotidiennement.',
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pmn-green-600 to-pmn-green-700 text-white py-16 lg:py-24">
        <div className="container-pmn">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-5xl font-bold mb-6">
              Comment ça marche ?
            </h1>
            <p className="text-lg lg:text-xl text-white/90 mb-8">
              Guide pratique pour accéder aux appels d&apos;offres publics du Sénégal 
              et postuler aux marchés de l&apos;État. Aucune inscription requise.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/appels-offres">
                Commencer à explorer
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 lg:py-24">
        <div className="container-pmn">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              6 étapes pour postuler
            </h2>
            <p className="text-muted-foreground">
              Un processus simple et transparent pour accéder à la commande publique
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step) => (
              <Card key={step.number} className="relative overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-bold text-muted-foreground/20">
                      {step.number}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-pmn">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-pmn-gold-100 dark:bg-pmn-gold-900/30 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-pmn-gold-600" />
            </div>
            <h2 className="text-2xl font-bold">Conseils pratiques</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => (
              <Card key={index} className="border-l-4 border-l-pmn-gold-500">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16">
        <div className="container-pmn">
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">
                    Information importante
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 mb-4">
                    La plateforme PMN est un outil de veille et de consultation. 
                    La soumission officielle des offres doit se faire via le portail 
                    officiel des marchés publics du Sénégal.
                  </p>
                  <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-100" asChild>
                    <a href="http://www.marchespublics.sn" target="_blank" rel="noopener noreferrer">
                      Accéder au portail officiel
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pmn-green-600 to-pmn-green-700 text-white">
        <div className="container-pmn text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Prêt à consulter les appels d&apos;offres ?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Accédez gratuitement à tous les appels d&apos;offres publics du Sénégal. 
            Aucune inscription requise.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/appels-offres">
              Explorer les appels d&apos;offres
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
