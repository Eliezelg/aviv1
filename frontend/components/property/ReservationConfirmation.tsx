"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Calendar, Users, Euro } from "lucide-react";

interface ReservationConfirmationProps {
  reservationId: string;
  lang: string;
  stripeSessionId?: string;
}

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  numberOfGuests: number;
  specialRequests?: string;
  totalPrice: number;
  depositAmount: number;
  depositPaid: boolean;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  confirmationCode: string;
  guestEmail: string;
  property: {
    id: string;
    name: string;
    images: string[];
  };
}

const ReservationConfirmation = ({ reservationId, lang, stripeSessionId }: ReservationConfirmationProps) => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending' | 'failed'>('pending');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reservations/${reservationId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors du chargement des détails de la réservation');
        }

        setReservation(data);
        
        // Si la réservation est confirmée ou si l'acompte est payé, mettre à jour le statut du paiement
        if (data.status === 'CONFIRMED' || data.depositPaid) {
          setPaymentStatus('paid');
        }
        
        // Si nous avons un session_id de Stripe, vérifier le statut du paiement
        if (stripeSessionId) {
          const paymentResponse = await fetch(`http://localhost:5000/api/payments/check/${stripeSessionId}`);
          const paymentData = await paymentResponse.json();
          
          if (paymentResponse.ok && paymentData.paid) {
            setPaymentStatus('paid');
          } else if (!paymentResponse.ok) {
            setPaymentStatus('failed');
          }
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservationDetails();
  }, [reservationId, stripeSessionId, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Réservation non trouvée</h3>
        <p className="text-muted-foreground mb-6">
          Impossible de trouver les détails de cette réservation.
        </p>
        <Button onClick={() => router.push(`/${lang}`)}>Retour à l'accueil</Button>
      </div>
    );
  }

  const startDate = new Date(reservation.startDate);
  const endDate = new Date(reservation.endDate);
  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {paymentStatus === 'paid' 
            ? 'Réservation confirmée!' 
            : paymentStatus === 'failed'
              ? 'Paiement échoué'
              : 'Réservation en attente de paiement'}
        </h1>
        <p className="text-muted-foreground">
          {paymentStatus === 'paid' 
            ? 'Votre réservation a été enregistrée avec succès et votre acompte a été payé.' 
            : paymentStatus === 'failed'
              ? 'Le paiement de votre acompte a échoué. Veuillez réessayer.'
              : 'Votre réservation a été enregistrée mais est en attente du paiement de l\'acompte.'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails de la réservation</CardTitle>
          <CardDescription>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span>Référence: <span className="font-mono">{reservation.id}</span></span>
              <span>Code de confirmation: <span className="font-mono">{reservation.confirmationCode}</span></span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">{reservation.property.name}</h3>
            <Badge>
              {reservation.status === 'PENDING' 
                ? 'En attente' 
                : reservation.status === 'CONFIRMED'
                  ? 'Confirmée'
                  : reservation.status === 'CANCELLED'
                    ? 'Annulée'
                    : 'Terminée'}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Dates</p>
                <p className="text-sm text-muted-foreground">
                  {format(startDate, "d MMM", { locale: fr })} - {format(endDate, "d MMM yyyy", { locale: fr })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {nights} nuit{nights > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Voyageurs</p>
                <p className="text-sm text-muted-foreground">
                  {reservation.numberOfGuests} personne{reservation.numberOfGuests > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Euro className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Prix</p>
                <p className="text-sm text-muted-foreground">
                  Total: {reservation.totalPrice}€
                </p>
                <p className="text-sm text-muted-foreground">
                  Acompte: {reservation.depositAmount}€ ({reservation.depositPaid ? 'Payé' : 'En attente'})
                </p>
              </div>
            </div>
          </div>

          {reservation.specialRequests && (
            <div>
              <p className="font-medium mb-1">Demandes spéciales</p>
              <p className="text-sm">{reservation.specialRequests}</p>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              Un email de confirmation a été envoyé à <strong>{reservation.guestEmail}</strong>. 
              Vous pouvez également consulter vos réservations à tout moment en utilisant votre email et code de confirmation.
            </p>
          </div>
          
          {paymentStatus === 'pending' && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800 font-medium">
                Votre réservation est en attente du paiement de l'acompte. Veuillez cliquer sur le bouton ci-dessous pour procéder au paiement.
              </p>
            </div>
          )}
          
          {paymentStatus === 'failed' && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-800 font-medium">
                Le paiement de votre acompte a échoué. Veuillez réessayer en cliquant sur le bouton ci-dessous.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          {paymentStatus === 'paid' ? (
            <>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto" 
                onClick={() => router.push(`/${lang}/reservation/guest`)}
              >
                Voir mes réservations
              </Button>
              <Button 
                className="w-full sm:w-auto" 
                onClick={() => router.push(`/${lang}`)}
              >
                Retour à l'accueil
              </Button>
            </>
          ) : (
            <>
              <Button 
                className="w-full sm:w-auto" 
                onClick={async () => {
                  try {
                    // Récupérer une nouvelle session de paiement
                    const response = await fetch(`http://localhost:5000/api/payments/create-session`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        reservationId: reservation.id,
                        frontendUrl: window.location.origin,
                      }),
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok) {
                      throw new Error(data.message || 'Erreur lors de la création de la session de paiement');
                    }
                    
                    // Rediriger vers la page de paiement Stripe
                    if (data.url) {
                      window.location.href = data.url;
                    }
                  } catch (error: any) {
                    toast({
                      variant: "destructive",
                      title: "Erreur",
                      description: error.message,
                    });
                  }
                }}
              >
                Payer l'acompte
              </Button>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto" 
                onClick={() => router.push(`/${lang}`)}
              >
                Retour à l'accueil
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReservationConfirmation;
