import { Metadata } from 'next';
import { redirect } from 'next/navigation';
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

interface AdminPageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: AdminPageProps): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  
  return {
    title: 'Administration - Villa Aviv',
    description: 'Panneau d\'administration pour Villa Aviv',
  };
}

export default async function AdminPage({ params }: AdminPageProps) {
  // Rediriger vers la page de gestion des propriétés par défaut
  redirect(`/${params.lang}/admin/properties`);
}
