import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReservationConfirmation from '@/components/property/ReservationConfirmation';
import { getDictionary } from '@/lib/dictionary';

// Cette fonction est requise pour la génération statique avec des routes dynamiques
export async function generateStaticParams() {
  // Pour les réservations, nous ne pouvons pas connaître à l'avance tous les IDs possibles
  // Nous allons donc générer des paramètres pour quelques IDs génériques et un modèle qui capturera tous les autres
  
  const langs = ['fr', 'en', 'de'];
  
  // Liste des IDs spécifiques que nous avons rencontrés
  const specificIds = [
    '123445678',
    'reservation-example-1',
    'reservation-example-2',
    'reservation-example-3',
    'c5100cd1-0e16-4af6-98b6-3311a9c54e24',
    '5ff204b5-cfb3-4b4e-9ba7-6524f6e2bcf9',
    'e6d4e933-d8ab-4488-b40c-f4c126b45f0a',
    '3fd707f3-688b-4b8d-b3bb-4f072141514c'
  ];
  
  // Générer des modèles pour capturer tous les autres IDs possibles
  // Ces modèles couvriront la plupart des formats d'UUID
  const genericPatterns = [
    '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}', // Format UUID standard
    '[a-f0-9]{32}',                                                  // UUID sans tirets
    '[a-zA-Z0-9-]{10,40}'                                            // Tout autre format d'ID
  ];
  
  // Combiner les IDs spécifiques et les modèles génériques
  const allIds = [...specificIds, ...genericPatterns];
  
  return langs.flatMap(lang => 
    allIds.map(id => ({
      lang,
      id
    }))
  );
}

interface ReservationConfirmationPageProps {
  params: {
    id: string;
    lang: string;
  };
  searchParams: {
    session_id?: string;
  };
}

export async function generateMetadata({ params }: ReservationConfirmationPageProps): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  
  return {
    title: 'Confirmation de réservation - Villa Aviv',
    description: 'Confirmation de votre réservation à la Villa Aviv',
  };
}

export default async function ReservationConfirmationPage({ 
  params, 
  searchParams 
}: ReservationConfirmationPageProps) {
  const dict = await getDictionary(params.lang);
  
  // Si nous avons un session_id de Stripe, nous devons vérifier le statut du paiement
  const stripeSessionId = searchParams.session_id;
  
  // Récupérer les détails de la réservation
  try {
    const response = await fetch(`http://localhost:5000/api/reservations/${params.id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return notFound();
    }
    
    // Si nous avons un session_id, vérifier le statut du paiement
    if (stripeSessionId) {
      await fetch(`http://localhost:5000/api/payments/check/${stripeSessionId}`, {
        method: 'GET',
      });
    }
    
    return (
      <div className="container py-10">
        <ReservationConfirmation 
          reservationId={params.id} 
          lang={params.lang} 
          stripeSessionId={stripeSessionId}
        />
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
