import { Metadata } from 'next';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface PropertyActivitiesPageProps {
  params: {
    lang: string;
    id: string;
  };
}

export async function generateMetadata({ params }: PropertyActivitiesPageProps): Promise<Metadata> {
  try {
    // Récupérer les détails de la propriété pour le titre de la page
    const response = await fetch(`http://localhost:5000/api/property/${params.id}`);
    const property = await response.json();
    
    return {
      title: `Activités - ${property.name}`,
      description: `Découvrez les activités à proximité de ${property.name}`,
    };
  } catch (error) {
    return {
      title: 'Activités - Villa Aviv',
      description: 'Découvrez les activités à proximité',
    };
  }
}

// Données fictives pour les activités (à remplacer par des données réelles)
const activities = [
  {
    id: 'randonnee',
    name: 'Randonnées en montagne',
    description: 'Explorez les magnifiques sentiers de randonnée à proximité, avec des vues imprenables sur les montagnes et les vallées.',
    distance: '5 km',
    duration: 'Demi-journée à journée complète',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=3270&auto=format&fit=crop'
  },
  {
    id: 'vtt',
    name: 'Parcours VTT',
    description: 'Des parcours VTT pour tous les niveaux, des pistes familiales aux descentes techniques pour les plus expérimentés.',
    distance: '3 km',
    duration: '2-4 heures',
    category: 'Sport',
    image: 'https://images.unsplash.com/photo-1594548767-dbd3f1137ad8?q=80&w=3270&auto=format&fit=crop'
  },
  {
    id: 'golf',
    name: 'Golf 18 trous',
    description: 'Un parcours de golf exceptionnel dans un cadre idyllique, avec des fairways impeccables et des greens parfaitement entretenus.',
    distance: '8 km',
    duration: 'Demi-journée',
    category: 'Sport',
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=3270&auto=format&fit=crop'
  },
  {
    id: 'vignobles',
    name: 'Visite des vignobles',
    description: 'Découvrez les vignobles locaux et dégustez les vins de la région lors d\'une visite guidée par des vignerons passionnés.',
    distance: '15 km',
    duration: 'Demi-journée',
    category: 'Gastronomie',
    image: 'https://images.unsplash.com/photo-1596133053443-6e2bde8fcc9f?q=80&w=3270&auto=format&fit=crop'
  },
  {
    id: 'marche',
    name: 'Marché local',
    description: 'Immergez-vous dans la culture locale en visitant le marché traditionnel où vous trouverez des produits frais et artisanaux.',
    distance: '7 km',
    duration: 'Matinée',
    category: 'Culture',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=3270&auto=format&fit=crop'
  },
  {
    id: 'chateau',
    name: 'Visite du château médiéval',
    description: 'Explorez un château médiéval parfaitement conservé et découvrez l\'histoire fascinante de la région.',
    distance: '12 km',
    duration: '2-3 heures',
    category: 'Culture',
    image: 'https://images.unsplash.com/photo-1583002083769-0b17f28a9906?q=80&w=3270&auto=format&fit=crop'
  }
];

// Grouper les activités par catégorie
const groupedActivities = activities.reduce((acc, activity) => {
  if (!acc[activity.category]) {
    acc[activity.category] = [];
  }
  acc[activity.category].push(activity);
  return acc;
}, {} as Record<string, typeof activities>);

export default async function PropertyActivitiesPage({ params }: PropertyActivitiesPageProps) {
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
        
        <h1 className="text-3xl font-bold mb-2">Activités autour de {property.name}</h1>
        <p className="text-muted-foreground mb-8">
          Découvrez les nombreuses activités disponibles à proximité pour rendre votre séjour encore plus mémorable.
        </p>
        
        <div className="space-y-12">
          {Object.entries(groupedActivities).map(([category, categoryActivities]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-6">{category}</h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categoryActivities.map((activity) => (
                  <Card key={activity.id} className="flex flex-col h-full">
                    <div className="relative h-48 w-full">
                      <Image
                        src={activity.image}
                        alt={activity.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{activity.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="mb-4">{activity.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>Distance: {activity.distance}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Durée: {activity.duration}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Badge>{category}</Badge>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Besoin d'aide pour organiser vos activités ?</h2>
          <p className="mb-4">
            Notre équipe de conciergerie est à votre disposition pour vous aider à planifier vos activités 
            et réserver vos excursions pendant votre séjour.
          </p>
          <Button asChild>
            <Link href={`/${params.lang}/contact`}>
              Nous contacter
            </Link>
          </Button>
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
