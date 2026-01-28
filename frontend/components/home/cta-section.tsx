'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Bell, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  'Accès libre et gratuit à tous les appels d\'offres',
  'Documents officiels disponibles en ligne',
  'Filtrage par secteur d\'activité',
  'Informations mises à jour quotidiennement',
  'Guide pratique pour les artisans',
];

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-pmn-green-600 via-pmn-green-700 to-pmn-green-800 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-hero-pattern" />
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pmn-gold-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <div className="container-pmn relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm mb-6">
              <Bell className="w-4 h-4" />
              <span>Ne manquez plus aucune opportunité</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Accédez librement à la commande publique
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Consultez en temps réel les appels d&apos;offres publics au Sénégal.
              Une plateforme dédiée aux artisans pour identifier, comprendre et saisir
              les opportunités de marchés publics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="xl"
                variant="secondary"
                className="text-pmn-green-700 font-semibold"
                asChild
              >
                <Link href="/appels-offres">
                  Voir les appels d&apos;offres
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/guide">En savoir plus</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right content - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
          >
            <h3 className="text-xl font-semibold mb-6">
              Avantages de la plateforme
            </h3>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-pmn-gold-400 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-pmn-gold-400 to-pmn-gold-500 border-2 border-white flex items-center justify-center text-xs font-semibold text-pmn-green-800"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">+5,000</span>
                  <span className="text-white/70"> artisans accompagnés</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
