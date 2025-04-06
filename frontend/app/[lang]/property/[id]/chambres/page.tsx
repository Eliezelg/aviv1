import { Metadata } from 'next';
import { ArrowLeft, Bed } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDictionary } from '@/lib/dictionary';
import { Navbar } from "@/components/navbar";
import { PrismaClient } from '@prisma/client';

// Cette fonction est requise pour la génération statique avec des routes dynamiques
export async function generateStaticParams() {
  try {
    const response = await fetch('http://localhost:5000/api/property');
    const properties = await response.json();
    
    const langs = ['fr', 'en', 'de'];
    
    return langs.flatMap(lang => 
      properties.map((property: any) => ({
        lang,
        id: property.id
      }))
    );
  } catch (error) {
    // En cas d'erreur, retourner au moins les paramètres pour les langues
    const langs = ['fr', 'en', 'de'];
    return langs.map(lang => ({ lang, id: '123445678' }));
  }
}

interface PropertyRoomsPageProps {
  params: {
    lang: string;
    id: string;
  };
}

export async function generateMetadata({ params }: PropertyRoomsPageProps): Promise<Metadata> {
  try {
    // Récupérer les détails de la propriété pour le titre de la page
    const response = await fetch(`http://localhost:5000/api/property/${params.id}`);
    const property = await response.json();
    
    return {
      title: `Chambres - ${property.name}`,
      description: `Découvrez les chambres de ${property.name}`,
    };
  } catch (error) {
    return {
      title: 'Chambres - Villa Aviv',
      description: 'Découvrez nos chambres',
    };
  }
}

// Données fictives pour les chambres (à remplacer par des données réelles)
const rooms = [
  {
    id: 'chambre-1',
    name: 'Chambre Deluxe',
    description: 'Chambre spacieuse avec lit king-size et vue sur le jardin',
    capacity: 2,
    beds: 'Lit King-size',
    size: '30m²',
    amenities: ['Salle de bain privative', 'Climatisation', 'TV écran plat', 'Minibar', 'Coffre-fort'],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=3270&auto=format&fit=crop'
  },
  {
    id: 'chambre-2',
    name: 'Suite Junior',
    description: 'Suite élégante avec espace salon et grande terrasse privative',
    capacity: 2,
    beds: 'Lit Queen-size',
    size: '40m²',
    amenities: ['Salle de bain avec baignoire', 'Terrasse privée', 'Climatisation', 'TV écran plat', 'Minibar'],
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=3274&auto=format&fit=crop'
  },
  {
    id: 'chambre-3',
    name: 'Suite Familiale',
    description: 'Suite spacieuse idéale pour les familles avec deux chambres séparées',
    capacity: 4,
    beds: '1 Lit King-size + 2 lits simples',
    size: '60m²',
    amenities: ['2 Salles de bain', 'Salon séparé', 'Climatisation', 'TV écran plat', 'Minibar', 'Coffre-fort'],
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=3157&auto=format&fit=crop'
  },
  {
    id: 'chambre-4',
    name: 'Chambre Twin',
    description: 'Chambre confortable avec deux lits simples',
    capacity: 2,
    beds: '2 lits simples',
    size: '25m²',
    amenities: ['Salle de bain privative', 'Climatisation', 'TV écran plat', 'Bureau'],
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=3270&auto=format&fit=crop'
  }
];

export default async function PropertyRoomsPage({ params }: PropertyRoomsPageProps) {
  const dict = await getDictionary(params.lang);
  
  // Récupérer les détails de la propriété
  let property;
  try {
    const response = await fetch(`http://localhost:5000/api/property/${params.id}`);
    property = await response.json();
  } catch (error) {
    property = { name: 'Propriété' };
  }
  
  return (
    <div>
      <div className="container py-4">
        <Navbar lang={params.lang} propertyId={params.id} />
      </div>
      
      <div className="container py-10">
        <div className="mb-6">
          <Link href={`/${params.lang}/property/${params.id}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft size={16} />
              Retour à la propriété
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Chambres de {property.name}</h1>
        <p className="text-muted-foreground mb-8">
          Découvrez nos chambres confortables et élégantes pour un séjour inoubliable.
        </p>
        
        <div className="grid gap-8 md:grid-cols-2">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{room.name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2 mt-1">
                        <Bed className="h-4 w-4" />
                        <span>Capacité: {room.capacity} personnes</span>
                      </div>
                    </CardDescription>
                  </div>
                  <Badge>{room.size}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{room.description}</p>
                
                <div>
                  <h3 className="font-semibold mb-2">Couchages</h3>
                  <p>{room.beds}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Équipements</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline">{amenity}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="mb-6 text-lg">
            Prêt à réserver votre séjour dans cette propriété d'exception ?
          </p>
          <Button asChild size="lg">
            <Link href={`/${params.lang}/property/${params.id}/reservation`}>
              Réserver maintenant
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
