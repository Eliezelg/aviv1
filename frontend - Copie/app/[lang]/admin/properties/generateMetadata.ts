import { Metadata } from 'next';
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

interface AdminPropertiesPageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: AdminPropertiesPageProps): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  
  return {
    title: 'Administration des propriétés - Villa Aviv',
    description: 'Gérez les propriétés disponibles sur le site Villa Aviv',
  };
}
