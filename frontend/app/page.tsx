import Link from 'next/link';
import { 
  Search, 
  Bell, 
  FileText, 
  ArrowRight, 
  CheckCircle2,
  Briefcase,
  Shirt,
  Sofa,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroSection } from '@/components/home/hero-section';
import { StatsSection } from '@/components/home/stats-section';
import { ModulesSection } from '@/components/home/modules-section';
import { RecentTenders } from '@/components/home/recent-tenders';
import { CTASection } from '@/components/home/cta-section';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Modules Section */}
      <ModulesSection />

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container-pmn">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simplifiez votre accès à la{' '}
              <span className="gradient-text">commande publique</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Notre plateforme centralise tous les appels d&apos;offres et vous aide à ne manquer aucune opportunité.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="card-hover border-0 shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pmn-green-500 to-pmn-green-600 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Recherche Intelligente</CardTitle>
                <CardDescription>
                  Trouvez rapidement les appels d&apos;offres qui correspondent à votre activité grâce à nos filtres avancés.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="card-hover border-0 shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pmn-gold-500 to-pmn-gold-600 flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Alertes Personnalisées</CardTitle>
                <CardDescription>
                  Recevez des notifications par email ou WhatsApp dès qu&apos;un nouvel appel d&apos;offres correspond à vos critères.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="card-hover border-0 shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Dossiers Complets</CardTitle>
                <CardDescription>
                  Accédez directement aux documents officiels et téléchargez les dossiers d&apos;appels d&apos;offres.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="card-hover border-0 shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Mise à Jour Quotidienne</CardTitle>
                <CardDescription>
                  Notre système scrape automatiquement les nouveaux appels d&apos;offres 3 fois par jour.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="card-hover border-0 shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Suivi des Opportunités</CardTitle>
                <CardDescription>
                  Marquez vos favoris, consultez votre historique et suivez les appels d&apos;offres qui vous intéressent.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="card-hover border-0 shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Source Officielle</CardTitle>
                <CardDescription>
                  Données provenant directement du portail officiel marchespublics.sn, garantissant leur authenticité.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Tenders */}
      <RecentTenders />

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container-pmn">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-muted-foreground">
              Accédez aux marchés publics en quelques étapes simples
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Inscrivez-vous',
                description: 'Créez votre compte artisan gratuitement en quelques minutes',
              },
              {
                step: '02',
                title: 'Configurez vos alertes',
                description: 'Définissez vos critères : métier, région, type de marché',
              },
              {
                step: '03',
                title: 'Consultez les offres',
                description: 'Parcourez les appels d\'offres filtrés selon vos préférences',
              },
              {
                step: '04',
                title: 'Postulez',
                description: 'Téléchargez les dossiers et soumettez votre candidature',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary font-bold text-2xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
