import { Metadata } from 'next';
import PropertyList from '@/components/property/PropertyList';
import { getDictionary } from '@/lib/dictionary';

// Cette fonction est requise pour la génération statique avec des routes dynamiques
export function generateStaticParams() {
  // Définir les chemins de langue à pré-rendre
  return [
    { lang: 'fr' },
    { lang: 'en' },
    { lang: 'de' }
  ];
}

interface PropertiesPageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: PropertiesPageProps): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  
  return {
    title: 'Propriétés disponibles - Villa Aviv',
    description: 'Découvrez et réservez nos propriétés exceptionnelles',
  };
}

export default async function PropertiesPage({ params }: PropertiesPageProps) {
  const dict = await getDictionary(params.lang);
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Nos propriétés</h1>
      <p className="text-muted-foreground mb-8">
        Découvrez notre sélection de propriétés exceptionnelles et réservez votre séjour dès maintenant.
      </p>
      
      <PropertyList lang={params.lang} />
    </div>
  );
}
