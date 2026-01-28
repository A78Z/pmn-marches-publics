'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/appels-offres?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />
      
      {/* Gradient orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-pmn-green-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pmn-gold-500/20 rounded-full blur-3xl" />

      <div className="relative container-pmn py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Plateforme officielle du Projet Mobilier National</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Accédez aux{' '}
            <span className="gradient-text">marchés publics</span>
            <br />
            du Sénégal
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Consultez tous les appels d&apos;offres en temps réel, recevez des alertes
            personnalisées et développez votre activité artisanale.
          </motion.p>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un appel d'offre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button type="submit" size="xl" className="whitespace-nowrap">
              Rechercher
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.form>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 text-sm"
          >
            <span className="text-muted-foreground">Recherches populaires :</span>
            {['Nettoyage', 'Uniformes', 'Mobilier de bureau', 'Gardiennage'].map(
              (term) => (
                <Link
                  key={term}
                  href={`/appels-offres?q=${encodeURIComponent(term)}`}
                  className="text-primary hover:underline"
                >
                  {term}
                </Link>
              )
            )}
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute -bottom-10 left-10 hidden lg:block"
        >
          <div className="w-20 h-20 rounded-2xl bg-module-entretiens/20 rotate-12 flex items-center justify-center">
            <span className="text-3xl">🧹</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute -top-5 right-20 hidden lg:block"
        >
          <div className="w-16 h-16 rounded-2xl bg-module-tenues/20 -rotate-12 flex items-center justify-center">
            <span className="text-2xl">👔</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="absolute bottom-20 right-10 hidden lg:block"
        >
          <div className="w-24 h-24 rounded-2xl bg-module-achats/20 rotate-6 flex items-center justify-center">
            <span className="text-4xl">🪑</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
