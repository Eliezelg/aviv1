"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useToast } from "@/components/ui/use-toast";
import Image from 'next/image';
import ReservationForm from './ReservationForm';

interface Property {
  id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerNight: number;
  images: string[];
  amenities: string[];
  isAvailable: boolean;
}

interface PropertyDetailProps {
  propertyId: string;
  lang: string;
}

const PropertyDetail = ({ propertyId, lang }: PropertyDetailProps) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/property/${propertyId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors du chargement des détails de la propriété');
        }

        setProperty(data);
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

    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Propriété non trouvée</h3>
        <p className="text-muted-foreground mb-6">La propriété que vous recherchez n'existe pas ou a été supprimée.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          {property.images && property.images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {property.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${property.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="flex items-center justify-center h-[400px] bg-muted rounded-lg">
              <span className="text-muted-foreground">Pas d'image disponible</span>
            </div>
          )}
        </div>
        <div>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{property.name}</CardTitle>
                <Badge variant={property.isAvailable ? "default" : "secondary"} className="text-sm">
                  {property.isAvailable ? 'Disponible' : 'Non disponible'}
                </Badge>
              </div>
              <CardDescription>
                <div className="flex items-center gap-2 mt-1">
                  <span>Capacité: {property.capacity} personnes</span>
                  <span>•</span>
                  <span className="text-xl font-bold">{property.pricePerNight}€ / nuit</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p>{property.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Équipements</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities && property.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline">{amenity}</Badge>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={() => setShowReservationForm(true)} 
                className="w-full" 
                size="lg"
                disabled={!property.isAvailable}
              >
                Réserver maintenant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {showReservationForm && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Réserver {property.name}</CardTitle>
              <CardDescription>
                Complétez le formulaire ci-dessous pour effectuer votre réservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReservationForm 
                propertyId={property.id} 
                pricePerNight={property.pricePerNight} 
                maxGuests={property.capacity}
                lang={lang} 
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
