import type { Metadata, Viewport } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const fontSans = Outfit({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

const fontDisplay = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PMN Marchés Publics | Projet Mobilier National du Sénégal',
    template: '%s | PMN Marchés Publics',
  },
  description:
    "Plateforme officielle d'accès aux marchés publics pour les artisans sénégalais. Consultez les appels d'offres, recevez des alertes personnalisées et accédez à la commande publique.",
  keywords: [
    'marchés publics',
    'Sénégal',
    "appels d'offres",
    'artisans',
    'PMN',
    'Projet Mobilier National',
    'commande publique',
    'ARMP',
  ],
  authors: [{ name: 'Projet Mobilier National du Sénégal' }],
  creator: 'PMN Sénégal',
  publisher: 'Projet Mobilier National du Sénégal',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    url: 'https://pmn-marches.sn',
    siteName: 'PMN Marchés Publics',
    title: 'PMN Marchés Publics | Accédez à la commande publique',
    description:
      "Plateforme officielle pour les artisans sénégalais souhaitant accéder aux marchés publics.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PMN Marchés Publics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PMN Marchés Publics',
    description: "Accédez aux appels d'offres publics du Sénégal",
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#00853F' },
    { media: '(prefers-color-scheme: dark)', color: '#064e3b' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontDisplay.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster position="bottom-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
