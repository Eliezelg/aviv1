import { Suspense } from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import HomeMultiProperty from '@/components/home/HomeMultiProperty';
import HomeSingleProperty from '@/components/home/HomeSingleProperty';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Cette fonction est requise pour la génération statique avec des routes dynamiques
export function generateStaticParams() {
  // Définir les chemins de langue à pré-rendre
  return [
    { lang: 'fr' },
    { lang: 'en' },
    { lang: 'de' }
  ];
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  // Await the params object before using its properties
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  
  const dict = await getDictionary(lang);
  
  return {
    title: 'Villa Aviv - Location de propriétés exceptionnelles',
    description: 'Découvrez nos propriétés exceptionnelles pour vos séjours',
  };
}

// Composant serveur qui récupère la configuration
async function HomeWithConfig({ lang }: { lang: string }) {
  // Récupérer la configuration du site depuis l'API
  const configResponse = await fetch('http://localhost:5000/api/site-config', { cache: 'no-store' });
  const config = await configResponse.json();
  
  const dict = await getDictionary(lang);
  
  // Afficher la page appropriée selon le mode
  if (config.singlePropertyMode && config.mainPropertyId) {
    return <HomeSingleProperty propertyId={config.mainPropertyId} lang={lang} dict={dict} />;
  } else {
    return <HomeMultiProperty lang={lang} dict={dict} />;
  }
}

export default async function HomePage({ params }: { params: { lang: string } }) {
  // Await the params object before using its properties
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>}>
      <HomeWithConfig lang={lang} />
    </Suspense>
  );
}