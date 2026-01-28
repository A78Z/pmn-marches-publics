import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Admin PMN',
    default: 'Administration | PMN Marchés Publics',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Ajouter vérification d'authentification admin
  
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
