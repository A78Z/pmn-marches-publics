import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
        success:
          'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        warning:
          'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        info:
          'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        entretiens:
          'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        tenues:
          'border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
        achats:
          'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        vehicules:
          'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        chaussures_maroquinerie:
          'border-transparent bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
        equipements_militaires:
          'border-transparent bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
        mobilier_hospitalier:
          'border-transparent bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
        textiles_professionnels:
          'border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
        btp:
          'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        fabrication_metallique:
          'border-transparent bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-400',
        maintenance_industrielle:
          'border-transparent bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
        equipements_agricoles:
          'border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
