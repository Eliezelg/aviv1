import { Metadata } from 'next';
import { ArrowLeft, Waves, Utensils, Tv, Wifi, Car, Dumbbell } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from '@/lib/dictionary';
import { Navbar } from "@/components/navbar";

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

interface PropertyAmenitiesPageProps {
  params: {
    lang: string;
    id: string;
  };
}

export async function generateMetadata({ params }: PropertyAmenitiesPageProps): Promise<Metadata> {
  try {
    // Récupérer les détails de la propriété pour le titre de la page
    const response = await fetch(`http://localhost:5000/api/property/${params.id}`);
    const property = await response.json();
    
    return {
      title: `Équipements - ${property.name}`,
      description: `Découvrez les équipements de ${property.name}`,
    };
  } catch (error) {
    return {
      title: 'Équipements - Villa Aviv',
      description: 'Découvrez nos équipements',
    };
  }
}

// Données fictives pour les équipements (à remplacer par des données réelles)
const amenityCategories = [
  {
    id: 'piscine',
    name: 'Piscine et Bien-être',
    icon: Waves,
    description: 'Détendez-vous dans notre espace aquatique et bien-être',
    amenities: [
      {
        name: 'Piscine intérieure chauffée',
        description: 'Piscine de 12m x 6m chauffée à 29°C toute l\'année',
        image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=3270&auto=format&fit=crop'
      },
      {
        name: 'Jacuzzi',
        description: 'Jacuzzi extérieur avec vue panoramique',
        image: 'https://images.unsplash.com/photo-1621846886965-e6c8d9d3a2c1?q=80&w=3387&auto=format&fit=crop'
      },
      {
        name: 'Sauna',
        description: 'Sauna finlandais traditionnel',
        image: 'https://images.unsplash.com/photo-1554678945-452e87f3e3a1?q=80&w=3270&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'cuisine',
    name: 'Cuisine et Restauration',
    icon: Utensils,
    description: 'Tout ce qu\'il faut pour préparer de délicieux repas',
    amenities: [
      {
        name: 'Cuisine professionnelle',
        description: 'Cuisine entièrement équipée avec appareils haut de gamme',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=3270&auto=format&fit=crop'
      },
      {
        name: 'Barbecue extérieur',
        description: 'Espace barbecue avec four à pizza',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=3274&auto=format&fit=crop'
      },
      {
        name: 'Cave à vin',
        description: 'Cave à vin climatisée avec sélection de vins locaux',
        image: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?q=80&w=3270&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'divertissement',
    name: 'Divertissement',
    icon: Tv,
    description: 'De nombreuses options pour se divertir',
    amenities: [
      {
        name: 'Salle de cinéma',
        description: 'Salle de cinéma privée avec écran géant et système son Dolby Atmos',
        image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=3270&auto=format&fit=crop'
      },
      {
        name: 'Salle de jeux',
        description: 'Billard, baby-foot, jeux de société et console de jeux',
        image: 'https://images.unsplash.com/photo-1582647509711-c8aa8a8bef66?q=80&w=3270&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'sport',
    name: 'Sport et Loisirs',
    icon: Dumbbell,
    description: 'Restez en forme pendant votre séjour',
    amenities: [
      {
        name: 'Salle de fitness',
        description: 'Équipement de cardio et musculation haut de gamme',
        image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=3270&auto=format&fit=crop'
      },
      {
        name: 'Terrain de tennis',
        description: 'Court de tennis en résine synthétique',
        image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=3264&auto=format&fit=crop'
      }
    ]
  }
];

export default async function PropertyAmenitiesPage({ params }: PropertyAmenitiesPageProps) {
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
        
        <h1 className="text-3xl font-bold mb-2">Équipements de {property.name}</h1>
        <p className="text-muted-foreground mb-8">
          Découvrez tous les équipements disponibles pour rendre votre séjour exceptionnel.
        </p>
        
        <div className="space-y-16">
          {amenityCategories.map((category) => (
            <div key={category.id}>
              <div className="flex items-center gap-3 mb-6">
                <category.icon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">{category.name}</h2>
              </div>
              <p className="text-lg mb-6">{category.description}</p>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {category.amenities.map((amenity, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image
                        src={amenity.image}
                        alt={amenity.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{amenity.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{amenity.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
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
