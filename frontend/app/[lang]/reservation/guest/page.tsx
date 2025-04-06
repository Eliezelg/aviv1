import { Metadata } from 'next';
import GuestReservationAccess from '@/components/property/GuestReservationAccess';
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

interface GuestReservationPageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: GuestReservationPageProps): Promise<Metadata> {
  // Await the params object before using its properties
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  
  const dict = await getDictionary(lang);
  
  return {
    title: 'Accès Invité - Villa Aviv',
    description: 'Accédez à vos réservations sans compte',
  };
}

export default async function GuestReservationPage({ params }: GuestReservationPageProps) {
  // Await the params object before using its properties
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  
  const dict = await getDictionary(lang);
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Accès Invité</h1>
      <GuestReservationAccess lang={lang} />
    </div>
  );
}
