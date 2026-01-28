import { Metadata } from 'next';
import Link from 'next/link';
import {
  FileText,
  Users,
  Bell,
  RefreshCw,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Download,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatNumber } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Tableau de bord Admin',
  description: 'Tableau de bord administrateur PMN Marchés Publics',
};

// Mock data - sera remplacé par les données Parse
const stats = {
  totalAppels: 2547,
  appelsActifs: 1893,
  nouveauxAujourdui: 23,
  artisansInscrits: 5234,
  alertesEnvoyees: 15420,
  tauxOuverture: 68.5,
};

const recentScrapings = [
  {
    id: '1',
    date: '2026-01-28T18:00:00',
    statut: 'succes',
    nouveaux: 12,
    modifies: 5,
    duree: 45,
  },
  {
    id: '2',
    date: '2026-01-28T12:00:00',
    statut: 'succes',
    nouveaux: 8,
    modifies: 3,
    duree: 38,
  },
  {
    id: '3',
    date: '2026-01-28T06:00:00',
    statut: 'partiel',
    nouveaux: 3,
    modifies: 2,
    duree: 52,
    erreurs: 2,
  },
];

const moduleStats = [
  { module: 'entretiens', count: 847, percentage: 34, color: 'bg-emerald-500' },
  { module: 'tenues', count: 523, percentage: 21, color: 'bg-indigo-500' },
  { module: 'achats', count: 1130, percentage: 45, color: 'bg-amber-500' },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container-pmn py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Tableau de bord Administrateur
              </h1>
              <p className="text-gray-300">
                Gérez les appels d&apos;offres, le scraping et les utilisateurs
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Button className="bg-pmn-green-600 hover:bg-pmn-green-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Lancer le scraping
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-pmn py-8">
        {/* Stats cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Appels d&apos;offres
              </CardTitle>
              <FileText className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(stats.totalAppels)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+{stats.nouveauxAujourdui}</span> aujourd&apos;hui
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Appels Actifs
              </CardTitle>
              <Clock className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pmn-green-600">
                {formatNumber(stats.appelsActifs)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {((stats.appelsActifs / stats.totalAppels) * 100).toFixed(1)}% du total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Artisans Inscrits
              </CardTitle>
              <Users className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(stats.artisansInscrits)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+127</span> ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Alertes Envoyées
              </CardTitle>
              <Bell className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(stats.alertesEnvoyees)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Taux d&apos;ouverture: <span className="text-green-600">{stats.tauxOuverture}%</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Répartition par module */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par module</CardTitle>
                <CardDescription>
                  Distribution des appels d&apos;offres actifs par catégorie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moduleStats.map((stat) => (
                    <div key={stat.module} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {stat.module === 'entretiens' ? '🧹' : stat.module === 'tenues' ? '👔' : '🪑'}
                          </span>
                          <span className="font-medium capitalize">{stat.module}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatNumber(stat.count)} ({stat.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${stat.color} rounded-full transition-all duration-500`}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Historique des scrapings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Historique des scrapings</CardTitle>
                  <CardDescription>
                    Dernières synchronisations avec marchespublics.sn
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/scraping">
                    Voir tout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentScrapings.map((scraping) => (
                    <div
                      key={scraping.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {scraping.statut === 'succes' ? (
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">
                            {formatDate(scraping.date, {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            +{scraping.nouveaux} nouveaux, {scraping.modifies} modifiés
                            {scraping.erreurs && (
                              <span className="text-red-600 ml-2">
                                ({scraping.erreurs} erreurs)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={scraping.statut === 'succes' ? 'success' : 'warning'}
                        >
                          {scraping.statut}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {scraping.duree}s
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/appels-offres">
                    <FileText className="w-4 h-4 mr-2" />
                    Gérer les appels d&apos;offres
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/artisans">
                    <Users className="w-4 h-4 mr-2" />
                    Gérer les artisans
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/scraping">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Configuration scraping
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/notifications">
                    <Bell className="w-4 h-4 mr-2" />
                    Gérer les notifications
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres système
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Statut du système */}
            <Card>
              <CardHeader>
                <CardTitle>Statut du système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Scraping automatique</span>
                  <Badge variant="success">Actif</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Notifications email</span>
                  <Badge variant="success">Actif</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Notifications WhatsApp</span>
                  <Badge variant="secondary">Configuré</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Back4App</span>
                  <Badge variant="success">Connecté</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dernière sync</span>
                  <span className="text-sm text-muted-foreground">Il y a 2h</span>
                </div>
              </CardContent>
            </Card>

            {/* Alertes système */}
            <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                  Alertes système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">Structure HTML modifiée</div>
                  <p className="text-muted-foreground text-xs mt-1">
                    Certains sélecteurs ont échoué lors du dernier scraping.
                    Vérifiez les logs.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/admin/scraping/logs">
                    Voir les détails
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
