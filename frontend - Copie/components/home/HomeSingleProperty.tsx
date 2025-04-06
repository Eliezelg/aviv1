"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { useToast } from "@/components/ui/use-toast";

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

interface HomeSinglePropertyProps {
  propertyId: string;
  lang: string;
  dict: any;
}

const HomeSingleProperty = ({ propertyId, lang, dict }: HomeSinglePropertyProps) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/property/${propertyId}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement de la propriété');
        }
        
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les détails de la propriété",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
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
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-4">Propriété non trouvée</h1>
        <p className="text-muted-foreground mb-6">
          La propriété que vous recherchez n'existe pas ou a été supprimée.
        </p>
        <Button asChild>
          <Link href={`/${lang}/contact`}>
            {dict.common.contact_us || "Nous contacter"}
          </Link>
        </Button>
      </div>
    );
  }

  // Utiliser la première image de la propriété ou une image par défaut
  const heroImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=3271&auto=format&fit=crop";

  return (
    <main className="min-h-screen">
      <div className="relative h-[100vh]">
        <Image
          src={heroImage}
          alt={property.name}
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0">
          <div className="container mx-auto px-4">
            <div className="py-4">
              <Navbar lang={lang} propertyId={propertyId} />
            </div>
            <div className="flex h-[80vh] items-center justify-start">
              <div className="max-w-2xl text-white">
                <h1 className="mb-6 text-5xl font-bold">{property.name}</h1>
                <p className="mb-8 text-xl">
                  {property.description}
                </p>
                <div className="flex gap-4">
                  <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
                    <Link href={`/${lang}/reservation`}>
                      {dict.common.book_now || "Réserver maintenant"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                    <Link href={`/${lang}/chambres`}>
                      {dict.common.view_rooms || "Voir les chambres"}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">{dict.property.details || "Détails de la propriété"}</h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="aspect-video relative rounded-lg overflow-hidden">
                {property.images && property.images.length > 1 ? (
                  <Image
                    src={property.images[1]}
                    alt={`${property.name} - Image secondaire`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Pas d'image supplémentaire</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">{dict.property.capacity || "Capacité"}</h3>
                <p>{property.capacity} {dict.property.people || "personnes"}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">{dict.property.price || "Prix"}</h3>
                <p className="text-2xl font-bold">{property.pricePerNight}€ / {dict.property.night || "nuit"}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">{dict.property.amenities || "Équipements"}</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {property.amenities && property.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">•</span>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button asChild size="lg" className="w-full mt-6">
                <Link href={`/${lang}/reservation`}>
                  {dict.common.book_now || "Réserver maintenant"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomeSingleProperty;
