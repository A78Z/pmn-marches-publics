'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Search,
  Moon,
  Sun,
  ChevronDown,
  Briefcase,
  Shirt,
  Sofa,
  Car,
  Building2,
  Tractor,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navigation = [
  { name: 'Accueil', href: '/' },
  {
    name: 'Appels d\'offres',
    href: '/appels-offres',
    children: [
      { name: 'Tous les appels', href: '/appels-offres', icon: Search },
      { name: 'Entretiens', href: '/appels-offres?module=entretiens', icon: Briefcase },
      { name: 'Tenues', href: '/appels-offres?module=tenues', icon: Shirt },
      { name: 'Achats', href: '/appels-offres?module=achats', icon: Sofa },
      { name: 'Véhicules', href: '/appels-offres?module=vehicules', icon: Car },
      { name: 'BTP', href: '/appels-offres?module=btp', icon: Building2 },
      { name: 'Équipements Agricoles', href: '/appels-offres?module=equipements_agricoles', icon: Tractor },
    ],
  },
  { name: 'Comment ça marche', href: '/guide' },
  { name: 'À propos', href: '/a-propos' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm border-b'
          : 'bg-transparent'
      )}
    >
      {/* Senegal flag stripe */}
      <div className="h-1 senegal-gradient" />

      <nav className="container-pmn" aria-label="Navigation principale">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/logo-pmn.png"
                alt="Logo Projet Mobilier National"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
                priority
              />
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-foreground">PMN</span>
                <span className="text-xs block text-muted-foreground -mt-0.5">
                  Marchés Publics
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-8">
            {navigation.map((item) =>
              item.children ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        'flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary',
                        pathname.startsWith('/appels-offres')
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      )}
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.name} asChild>
                        <Link
                          href={child.href}
                          className="flex items-center gap-2"
                        >
                          <child.icon className="w-4 h-4" />
                          {child.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Changer le thème</span>
            </Button>

            {/* Accès direct aux appels d'offres */}
            <Button className="hidden sm:flex" asChild>
              <Link href="/appels-offres">
                <Search className="w-4 h-4 mr-2" />
                Explorer les appels
              </Link>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t bg-background"
          >
            <div className="container-pmn py-4 space-y-4">
              {navigation.map((item) =>
                item.children ? (
                  <div key={item.name} className="space-y-2">
                    <span className="text-sm font-semibold text-foreground">
                      {item.name}
                    </span>
                    <div className="pl-4 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <child.icon className="w-4 h-4" />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'block text-sm font-medium',
                      pathname === item.href
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
              <div className="pt-4 border-t">
                <Button className="w-full" asChild>
                  <Link href="/appels-offres">
                    <Search className="w-4 h-4 mr-2" />
                    Explorer les appels d&apos;offres
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
