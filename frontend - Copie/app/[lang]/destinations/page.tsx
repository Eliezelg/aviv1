import { Metadata } from 'next';
import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDictionary } from '@/lib/dictionary';

// Cette fonction est requise pour la génération statique avec des routes dynamiques
export function generateStaticParams() {
  return [
    { lang: 'fr' },
    { lang: 'en' },
    { lang: 'de' }
  ];
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  
  return {
    title: 'Nos Destinations - Villa Aviv',
    description: 'Découvrez nos différentes destinations pour votre prochain séjour',
  };
}

export default async function DestinationsPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang);
  
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href={`/${params.lang}`}>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft size={16} />
            {dict.common.back_to_home || "Retour à l'accueil"}
          </Button>
        </Link>
      </div>
      
      <h1 className="text-4xl font-bold mb-2">Nos Destinations</h1>
      <p className="text-xl text-muted-foreground mb-10">
        Découvrez les régions où se trouvent nos propriétés d'exception
      </p>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {destinations.map((destination, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-xl font-bold text-white">{destination.name}</h2>
                <div className="flex items-center text-white/80">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{destination.region}</span>
                </div>
              </div>
            </div>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                {destination.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="outline">{tag}</Badge>
                ))}
              </div>
              <CardDescription>{destination.shortDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{destination.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span>Nombre de propriétés: {destination.propertyCount}</span>
                <span className="font-medium">À partir de {destination.startingPrice}€/nuit</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/${params.lang}/properties?region=${destination.id}`}>
                  Voir les propriétés
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 p-8 bg-muted rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Vous ne trouvez pas votre destination idéale ?</h2>
        <p className="mb-6">
          Notre équipe est constamment à la recherche de nouvelles propriétés exceptionnelles dans les plus belles régions. 
          N'hésitez pas à nous contacter pour nous faire part de vos souhaits ou pour une demande personnalisée.
        </p>
        <Button asChild>
          <Link href={`/${params.lang}/contact`}>
            Nous contacter
          </Link>
        </Button>
      </div>
    </div>
  );
}

const destinations = [
  {
    id: "cote-azur",
    name: "Côte d'Azur",
    region: "Provence-Alpes-Côte d'Azur",
    image: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?q=80&w=3270&auto=format&fit=crop",
    tags: ["Mer", "Luxe", "Gastronomie"],
    shortDescription: "Le joyau de la Méditerranée française",
    description: "Découvrez nos villas de luxe sur la Côte d'Azur, entre plages de sable fin, villages pittoresques et vie nocturne animée. Un cadre idéal pour des vacances sous le soleil méditerranéen.",
    propertyCount: 5,
    startingPrice: 350
  },
  {
    id: "alpes",
    name: "Alpes françaises",
    region: "Auvergne-Rhône-Alpes",
    image: "https://images.unsplash.com/photo-1520766439748-438c6a408856?q=80&w=3269&auto=format&fit=crop",
    tags: ["Montagne", "Ski", "Nature"],
    shortDescription: "Chalets de luxe au cœur des montagnes",
    description: "Nos chalets alpins offrent un accès privilégié aux plus belles stations de ski des Alpes françaises, avec des vues imprenables sur les sommets et tout le confort nécessaire pour un séjour inoubliable.",
    propertyCount: 3,
    startingPrice: 400
  },
  {
    id: "paris",
    name: "Paris",
    region: "Île-de-France",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=3220&auto=format&fit=crop",
    tags: ["Ville", "Culture", "Gastronomie"],
    shortDescription: "Appartements d'exception dans la Ville Lumière",
    description: "Séjournez dans nos appartements haussmanniens au cœur de Paris, à proximité des plus beaux monuments et des quartiers les plus prisés. Le luxe parisien à portée de main.",
    propertyCount: 4,
    startingPrice: 300
  },
  {
    id: "provence",
    name: "Provence",
    region: "Provence-Alpes-Côte d'Azur",
    image: "https://images.unsplash.com/photo-1595867818082-083862f3d630?q=80&w=3270&auto=format&fit=crop",
    tags: ["Campagne", "Gastronomie", "Culture"],
    shortDescription: "Mas provençaux au milieu des lavandes",
    description: "Nos mas provençaux vous accueillent au cœur des champs de lavande et des oliviers, pour un séjour authentique dans l'une des plus belles régions de France. Piscines privées et terrasses ensoleillées.",
    propertyCount: 3,
    startingPrice: 280
  },
  {
    id: "corse",
    name: "Corse",
    region: "Corse",
    image: "https://images.unsplash.com/photo-1564959130747-897fb406b9e5?q=80&w=3387&auto=format&fit=crop",
    tags: ["Mer", "Montagne", "Nature"],
    shortDescription: "L'île de beauté vous attend",
    description: "Entre mer turquoise et montagnes sauvages, nos villas corses vous offrent un cadre idyllique pour des vacances ressourçantes. Plages privées et vues imprenables sur la Méditerranée.",
    propertyCount: 2,
    startingPrice: 320
  },
  {
    id: "alsace",
    name: "Alsace",
    region: "Grand Est",
    image: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=3270&auto=format&fit=crop",
    tags: ["Campagne", "Gastronomie", "Culture"],
    shortDescription: "Maisons à colombages et vignobles",
    description: "Découvrez le charme de l'Alsace dans nos propriétés traditionnelles, situées au cœur des vignobles et des villages pittoresques. L'endroit parfait pour découvrir la richesse culturelle et gastronomique de la région.",
    propertyCount: 2,
    startingPrice: 250
  }
];
