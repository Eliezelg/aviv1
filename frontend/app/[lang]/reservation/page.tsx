import { redirect } from 'next/navigation';
import { getDictionary } from '@/lib/dictionary';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Cette fonction est requise pour la génération statique avec des routes dynamiques
export function generateStaticParams() {
  return [
    { lang: 'fr' },
    { lang: 'en' },
    { lang: 'de' }
  ];
}

export default async function ReservationPage({ params }: { params: { lang: string } }) {
  // Récupérer la configuration du site
  const configResponse = await fetch('http://localhost:5000/api/site-config', { cache: 'no-store' });
  const config = await configResponse.json();
  
  // Si en mode mono-propriété, rediriger vers la page de réservation de la propriété principale
  if (config.singlePropertyMode && config.mainPropertyId) {
    return redirect(`/${params.lang}/property/${config.mainPropertyId}`);
  }
  
  // Sinon, rediriger vers la liste des propriétés
  return redirect(`/${params.lang}/properties`);
}
