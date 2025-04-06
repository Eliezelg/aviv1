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

interface LoginPageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  
  return {
    title: 'Connexion - Villa Aviv',
    description: 'Connectez-vous à votre compte Villa Aviv',
  };
}
