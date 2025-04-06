"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ReservationFormProps {
  propertyId: string;
  pricePerNight: number;
  maxGuests: number;
  lang: string;
}

// Interface pour les dates indisponibles
interface UnavailableDateRange {
  startDate: string;
  endDate: string;
}

const ReservationForm = ({ propertyId, pricePerNight, maxGuests, lang }: ReservationFormProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [unavailableDates, setUnavailableDates] = useState<UnavailableDateRange[]>([]);
  
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Récupérer les informations de l'utilisateur connecté s'il y en a
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
    if (user) {
      setEmail(user.email || '');
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, []);

  // Récupérer les dates indisponibles pour cette propriété
  useEffect(() => {
    const fetchUnavailableDates = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/property/${propertyId}/unavailable-dates`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des dates indisponibles');
        }
        const data = await response.json();
        setUnavailableDates(data);
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les dates indisponibles",
        });
      }
    };

    if (propertyId) {
      fetchUnavailableDates();
    }
  }, [propertyId, toast]);

  useEffect(() => {
    // Calculer le prix total et le montant de l'acompte lorsque les dates changent
    if (startDate && endDate) {
      const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const price = nights * pricePerNight;
      setTotalPrice(price);
      setDepositAmount(price * 0.3); // 30% d'acompte
    }
  }, [startDate, endDate, pricePerNight]);

  // Fonction pour vérifier si une date est désactivée (indisponible)
  const isDateDisabled = (date: Date) => {
    // Désactiver les dates passées
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      return true;
    }

    // Vérifier si la date est dans une plage indisponible
    return unavailableDates.some(range => {
      const rangeStartDate = new Date(range.startDate);
      const rangeEndDate = new Date(range.endDate);
      return date >= rangeStartDate && date <= rangeEndDate;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner les dates de votre séjour",
      });
      return;
    }

    if (startDate >= endDate) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "La date de départ doit être postérieure à la date d'arrivée",
      });
      return;
    }

    if (!email || !firstName || !lastName) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir vos informations personnelles",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Récupérer le token si l'utilisateur est connecté
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Vérifier d'abord la disponibilité
      const availabilityResponse = await fetch('http://localhost:5000/api/property/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          startDate,
          endDate,
        }),
      });

      const availabilityData = await availabilityResponse.json();

      if (!availabilityResponse.ok) {
        throw new Error(availabilityData.message || 'Erreur lors de la vérification de disponibilité');
      }

      if (!availabilityData.isAvailable) {
        throw new Error('Cette propriété n\'est pas disponible pour les dates sélectionnées');
      }

      // Créer la réservation
      const reservationResponse = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          propertyId,
          startDate,
          endDate,
          numberOfGuests,
          specialRequests,
          guestEmail: email,
          guestFirstName: firstName,
          guestLastName: lastName,
          frontendUrl: `${window.location.origin}/${lang}`,
        }),
      });

      const reservationData = await reservationResponse.json();

      if (!reservationResponse.ok) {
        throw new Error(reservationData.message || 'Erreur lors de la création de la réservation');
      }

      toast({
        title: "Redirection vers le paiement",
        description: "Vous allez être redirigé vers la page de paiement pour verser l'acompte",
      });

      // Rediriger vers la page de paiement Stripe
      if (reservationData.paymentUrl) {
        window.location.href = reservationData.paymentUrl;
      } else {
        // Fallback si l'URL de paiement n'est pas disponible
        router.push(`/${lang}/reservation/confirmation/${reservationData.reservation.id}`);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom *</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom *</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Date d'arrivée *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                disabled={(date) => isDateDisabled(date)}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">Date de départ *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) => isDateDisabled(date) || (!startDate && date <= new Date())}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numberOfGuests">Nombre de personnes *</Label>
        <Input
          id="numberOfGuests"
          type="number"
          min={1}
          max={maxGuests}
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
          required
        />
        <p className="text-xs text-muted-foreground">Maximum: {maxGuests} personnes</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialRequests">Demandes spéciales (optionnel)</Label>
        <Textarea
          id="specialRequests"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Précisez ici toute demande particulière..."
          className="min-h-[100px]"
        />
      </div>

      <div className="bg-muted p-4 rounded-lg space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Prix total</span>
          <span className="text-xl font-bold">{totalPrice}€</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Acompte à verser maintenant (30%)</span>
          <span className="font-semibold">{depositAmount}€</span>
        </div>
        {startDate && endDate && (
          <p className="text-sm text-muted-foreground mt-1">
            {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} nuits à {pricePerNight}€ par nuit
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          En cliquant sur "Réserver maintenant", vous serez redirigé vers notre plateforme de paiement sécurisée pour verser l'acompte de 30%.
        </p>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading || !startDate || !endDate}>
        {isLoading ? 'Traitement en cours...' : 'Réserver maintenant'}
      </Button>
    </form>
  );
};

export default ReservationForm;
