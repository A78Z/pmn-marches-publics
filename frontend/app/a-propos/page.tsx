import { Metadata } from 'next';
import Link from 'next/link';
import {
  Target,
  Users,
  Shield,
  Globe,
  ArrowRight,
  Building2,
  Briefcase,
  Heart,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'À propos | PMN Marchés Publics',
  description:
    'Découvrez la mission du Projet Mobilier National (PMN) : faciliter l\'accès des artisans sénégalais à la commande publique.',
};

const missions = [
  {
    title: 'Accessibilité',
    description:
      'Rendre les appels d\'offres publics accessibles à tous les artisans et entreprises du Sénégal, sans barrière technique.',
    icon: Globe,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    title: 'Transparence',
    description:
      'Centraliser l\'information sur les marchés publics pour une visibilité totale des opportunités disponibles.',
    icon: Shield,
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  {
    title: 'Accompagnement',
    description:
      'Guider les artisans dans leurs démarches de postulation grâce à des ressources pratiques et actualisées.',
    icon: Users,
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    title: 'Développement local',
    description:
      'Promouvoir le savoir-faire sénégalais et contribuer au développement économique des régions.',
    icon: Target,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
];

const values = [
  'Service public gratuit et accessible',
  'Information actualisée en temps réel',
  'Neutralité et impartialité',
  'Respect des procédures officielles',
  'Soutien à l\'économie locale',
  'Promotion de l\'artisanat sénégalais',
];

const stats = [
  { label: 'Appels d\'offres référencés', value: '2,500+' },
  { label: 'Institutions partenaires', value: '150+' },
  { label: 'Régions couvertes', value: '14' },
  { label: 'Modules métiers', value: '12' },
];

export default function AProposPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pmn-green-600 to-pmn-green-700 text-white py-16 lg:py-24">
        <div className="container-pmn">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
                <Building2 className="w-4 h-4" />
                Initiative du Projet Mobilier National
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold mb-6">
                Faciliter l&apos;accès à la commande publique
              </h1>
              <p className="text-lg lg:text-xl text-white/90 mb-8">
                Le Projet Mobilier National (PMN) met à disposition des artisans et 
                entreprises du Sénégal une plateforme gratuite de veille sur les 
                appels d&apos;offres publics.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/appels-offres">
                    Explorer les appels
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link href="/guide">
                    Comment ça marche
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center"
                >
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="container-pmn">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Notre mission</h2>
            <p className="text-muted-foreground">
              Démocratiser l&apos;accès aux marchés publics pour tous les acteurs 
              économiques du Sénégal
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {missions.map((mission) => (
              <Card key={mission.title} className="text-center">
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 rounded-xl ${mission.color} flex items-center justify-center mx-auto mb-4`}>
                    <mission.icon className="w-7 h-7" />
                  </div>
                  <CardTitle>{mission.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{mission.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About PMN Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-pmn">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-6">
                Le Projet Mobilier National
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Le <strong className="text-foreground">Projet Mobilier National (PMN)</strong> est 
                  une initiative de l&apos;État du Sénégal visant à promouvoir et développer 
                  l&apos;artisanat local dans le cadre de la commande publique.
                </p>
                <p>
                  Notre plateforme de veille sur les marchés publics s&apos;inscrit dans 
                  cette mission en offrant aux artisans, TPE et PME un accès simplifié 
                  et gratuit aux opportunités de marchés publiées par les institutions 
                  publiques sénégalaises.
                </p>
                <p>
                  En centralisant et classifiant les appels d&apos;offres par domaine 
                  d&apos;activité, nous permettons à chaque professionnel de trouver 
                  rapidement les marchés correspondant à son expertise.
                </p>
              </div>
            </div>
            <div>
              <Card className="border-pmn-green-200 bg-pmn-green-50/50 dark:border-pmn-green-800 dark:bg-pmn-green-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-pmn-green-700 dark:text-pmn-green-400">
                    <Heart className="w-5 h-5" />
                    Nos valeurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {values.map((value, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-pmn-green-600 flex-shrink-0" />
                        <span className="text-sm">{value}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-16">
        <div className="container-pmn">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              12 modules métiers couverts
            </h2>
            <p className="text-muted-foreground">
              Une classification adaptée aux différents corps de métiers de l&apos;artisanat 
              et de l&apos;industrie sénégalaise
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { emoji: '🧹', name: 'Entretiens' },
              { emoji: '👔', name: 'Tenues' },
              { emoji: '🪑', name: 'Achats' },
              { emoji: '🚗', name: 'Véhicules' },
              { emoji: '👞', name: 'Chaussures & Maroquinerie' },
              { emoji: '🛡️', name: 'Équipements Militaires' },
              { emoji: '🏥', name: 'Mobilier Hospitalier' },
              { emoji: '🦺', name: 'Textiles Professionnels' },
              { emoji: '🏗️', name: 'BTP' },
              { emoji: '🔩', name: 'Fabrication Métallique' },
              { emoji: '⚙️', name: 'Maintenance Industrielle' },
              { emoji: '🚜', name: 'Équipements Agricoles' },
            ].map((module, index) => (
              <Link
                key={index}
                href={`/appels-offres?module=${module.name.toLowerCase().replace(/[^a-z]/g, '_')}`}
                className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:border-primary hover:shadow-md transition-all"
              >
                <span className="text-2xl">{module.emoji}</span>
                <span className="text-sm font-medium">{module.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pmn-green-600 to-pmn-green-700 text-white">
        <div className="container-pmn text-center">
          <Briefcase className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Accédez aux marchés publics dès maintenant
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Plateforme gratuite et sans inscription. Consultez les appels d&apos;offres 
            et trouvez les opportunités adaptées à votre activité.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/appels-offres">
              Consulter les appels d&apos;offres
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
