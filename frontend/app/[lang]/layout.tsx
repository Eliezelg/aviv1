import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Villa Aviv - Luxurious Villa in Diemeringen, France',
  description: 'Discover Villa Aviv, a spacious 1000m² luxury villa in Diemeringen, France. Perfect for groups up to 50 people, featuring indoor pool, cinema, and more.',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  // Await the params object before using its properties
  const resolvedParams = await params;
  const { lang } = resolvedParams;

  return (
    <div className={inter.className}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container py-3">
          <Navbar lang={lang} />
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="border-t bg-muted/50">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Villa Aviv</h3>
              <p className="text-sm text-muted-foreground">
                Une demeure d'exception au cœur de Diemeringen
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Liens</h3>
              <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href={`/${lang}`} className="hover:underline">Accueil</a>
                <a href={`/${lang}/properties`} className="hover:underline">Propriétés</a>
                <a href={`/${lang}/galerie`} className="hover:underline">Galerie</a>
                <a href={`/${lang}/contact`} className="hover:underline">Contact</a>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Réservations</h3>
              <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href={`/${lang}/reservation/guest`} className="hover:underline">Accès invité</a>
                <a href={`/${lang}/properties`} className="hover:underline">Réserver maintenant</a>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Légal</h3>
              <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href={`/${lang}/mentions-legales`} className="hover:underline">Mentions légales</a>
                <a href={`/${lang}/confidentialite`} className="hover:underline">Politique de confidentialité</a>
              </nav>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Villa Aviv. Tous droits réservés.
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}