import Link from 'next/link';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container-pmn py-6">
        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Projet Mobilier National du Sénégal. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="sr-only">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Source attribution */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Données provenant de{' '}
            <a
              href="http://www.marchespublics.sn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              marchespublics.sn
            </a>
            {' '}| Portail officiel de la commande publique au Sénégal
          </p>
        </div>
      </div>

      {/* Senegal flag stripe */}
      <div className="h-1 senegal-gradient" />
    </footer>
  );
}
