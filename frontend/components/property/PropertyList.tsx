"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Image from 'next/image';

interface Property {
  id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerNight: number;
  images: string[];
  isAvailable: boolean;
}

interface PropertyListProps {
  lang: string;
}

const PropertyList = ({ lang }: PropertyListProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/property');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors du chargement des propriétés');
        }

        setProperties(data);
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

    fetchProperties();
  }, [toast]);

  const handleViewProperty = (id: string) => {
    router.push(`/${lang}/property/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Aucune propriété disponible</h3>
        <p className="text-muted-foreground">Aucune propriété n'est actuellement disponible.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <Card key={property.id} className="overflow-hidden">
          <div className="relative h-48 w-full">
            {property.images && property.images.length > 0 ? (
              <Image
                src={property.images[0]}
                alt={property.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted">
                <span className="text-muted-foreground">Pas d'image</span>
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Badge variant={property.isAvailable ? "default" : "secondary"}>
                {property.isAvailable ? 'Disponible' : 'Non disponible'}
              </Badge>
            </div>
          </div>
          <CardHeader>
            <CardTitle>{property.name}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2">
                <span>Capacité: {property.capacity} personnes</span>
                <span>•</span>
                <span className="font-bold">{property.pricePerNight}€ / nuit</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3">{property.description}</p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleViewProperty(property.id)} 
              className="w-full"
            >
              Voir les détails
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PropertyList;
