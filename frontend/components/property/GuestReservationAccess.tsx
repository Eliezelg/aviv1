"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface GuestReservationAccessProps {
  lang: string;
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
  property: {
    id: string;
    name: string;
    images: string[];
  };
}

const GuestReservationAccess = ({ lang }: GuestReservationAccessProps) => {
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Vérifier si les informations sont déjà dans sessionStorage
    const storedEmail = sessionStorage.getItem('guestEmail');
    const storedCode = sessionStorage.getItem('guestConfirmationCode');
    
    if (storedEmail && storedCode) {
      setEmail(storedEmail);
      setConfirmationCode(storedCode);
      fetchReservations(storedEmail, storedCode);
    }
  }, []);

  const fetchReservations = async (guestEmail: string, code: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/reservations/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: guestEmail,
          confirmationCode: code,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des réservations');
      }
      
      setReservations(data);
      setIsAuthenticated(true);
      
      // Stocker les informations dans sessionStorage pour permettre la navigation
      sessionStorage.setItem('guestEmail', guestEmail);
      sessionStorage.setItem('guestConfirmationCode', code);
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !confirmationCode) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
      });
      return;
    }
    
    fetchReservations(email, confirmationCode);
  };

  const handleCancelReservation = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reservations/${id}/cancel`, {
        method: 'PUT',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'annulation de la réservation');
      }
      
      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès",
      });
      
      // Mettre à jour la liste des réservations
      setReservations(reservations.map(reservation => 
        reservation.id === id 
          ? { ...reservation, status: 'CANCELLED' } 
          : reservation
      ));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'CONFIRMED': return 'Confirmée';
      case 'CANCELLED': return 'Annulée';
      case 'COMPLETED': return 'Terminée';
      default: return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PENDING': return 'outline';
      case 'CONFIRMED': return 'default';
      case 'CANCELLED': return 'destructive';
      case 'COMPLETED': return 'secondary';
      default: return 'outline';
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Accéder à vos réservations</CardTitle>
          <CardDescription>
            Entrez votre email et le code de confirmation reçu lors de votre réservation
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmationCode">Code de confirmation</Label>
              <Input
                id="confirmationCode"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Vous avez reçu ce code par email lors de votre réservation
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Chargement...' : 'Accéder à mes réservations'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  return (
    <div>
      <div className="bg-muted p-4 rounded-lg mb-6">
        <p>Réservations pour <strong>{email}</strong></p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : reservations.length > 0 ? (
        <div className="space-y-6">
          {reservations.map((reservation) => {
            const startDate = new Date(reservation.startDate);
            const endDate = new Date(reservation.endDate);
            const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={reservation.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{reservation.property.name}</CardTitle>
                      <CardDescription>
                        Du {format(startDate, "d MMMM yyyy", { locale: fr })} au {format(endDate, "d MMMM yyyy", { locale: fr })}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(reservation.status) as any}>
                      {getStatusLabel(reservation.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Durée</p>
                        <p className="font-medium">{nights} nuit{nights > 1 ? 's' : ''}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Voyageurs</p>
                        <p className="font-medium">{reservation.numberOfGuests} personne{reservation.numberOfGuests > 1 ? 's' : ''}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Prix total</p>
                        <p className="font-medium">{reservation.totalPrice}€</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Acompte</p>
                        <p className="font-medium">
                          {reservation.depositPaid ? 'Payé' : 'En attente'} ({reservation.depositAmount}€)
                        </p>
                      </div>
                    </div>
                    
                    {reservation.specialRequests && (
                      <div>
                        <p className="text-sm text-muted-foreground">Demandes spéciales</p>
                        <p className="text-sm mt-1">{reservation.specialRequests}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push(`/${lang}/property/${reservation.property.id}`)}
                  >
                    Voir la propriété
                  </Button>
                  {['PENDING', 'CONFIRMED'].includes(reservation.status) && (
                    <Button 
                      variant="destructive" 
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      Annuler
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Aucune réservation</h3>
          <p className="text-muted-foreground mb-6">Aucune réservation n'a été trouvée pour cet email.</p>
          <Button onClick={() => router.push(`/${lang}/properties`)}>Voir les propriétés disponibles</Button>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          onClick={() => {
            setIsAuthenticated(false);
            sessionStorage.removeItem('guestEmail');
            sessionStorage.removeItem('guestConfirmationCode');
          }}
          className="mr-4"
        >
          Se déconnecter
        </Button>
        <Button 
          variant="outline" 
          onClick={() => router.push(`/${lang}`)}
        >
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default GuestReservationAccess;
