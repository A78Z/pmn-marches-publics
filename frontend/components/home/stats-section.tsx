'use client';

import { motion } from 'framer-motion';
import { FileText, Building2, Users, Clock } from 'lucide-react';

const stats = [
  {
    name: 'Appels d\'offres',
    value: '2,500+',
    description: 'publiés cette année',
    icon: FileText,
    color: 'text-pmn-green-600',
    bgColor: 'bg-pmn-green-100 dark:bg-pmn-green-900/30',
  },
  {
    name: 'Institutions',
    value: '150+',
    description: 'partenaires publics',
    icon: Building2,
    color: 'text-pmn-gold-600',
    bgColor: 'bg-pmn-gold-100 dark:bg-pmn-gold-900/30',
  },
  {
    name: 'Artisans',
    value: '5,000+',
    description: 'inscrits sur la plateforme',
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  {
    name: 'Mise à jour',
    value: '3x/jour',
    description: 'synchronisation automatique',
    icon: Clock,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
  },
];

export function StatsSection() {
  return (
    <section className="py-16 border-y bg-muted/20">
      <div className="container-pmn">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${stat.bgColor} mb-4`}
              >
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className="text-3xl lg:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-foreground">{stat.name}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
