import { Metadata } from 'next';
import { ArrowLeft, Utensils, Car, Users, Sparkles, Wifi, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    title: 'Nos Services - Villa Aviv',
    description: 'Découvrez les services exclusifs proposés dans toutes nos propriétés',
  };
}

export default async function ServicesPage({ params }: { params: { lang: string } }) {
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
      
      <h1 className="text-4xl font-bold mb-2">Nos Services</h1>
      <p className="text-xl text-muted-foreground mb-10">
        Des services exclusifs pour un séjour d'exception dans toutes nos propriétés
      </p>
      
      <div className="grid gap-8 md:grid-cols-2 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Services inclus</h2>
          <p className="mb-6">
            Tous nos clients bénéficient des services suivants, inclus dans le prix de la réservation :
          </p>
          
          <div className="space-y-4">
            {includedServices.map((service, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="mt-1">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=3271&auto=format&fit=crop" 
            alt="Services inclus" 
            fill 
            className="object-cover"
          />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-6">Services premium</h2>
      <div className="grid gap-6 md:grid-cols-3 mb-16">
        {premiumServices.map((service, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="mb-2">
                <service.icon className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.shortDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{service.description}</p>
              <p className="mt-4 font-semibold">
                {service.price}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-muted p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Comment réserver nos services</h2>
        <p className="mb-6">
          Pour réserver l'un de nos services premium ou pour toute demande spécifique, vous pouvez :
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Contacter notre équipe au moment de votre réservation</li>
          <li>Nous envoyer un email à services@villaaviv.com</li>
          <li>Nous appeler au +33 1 23 45 67 89</li>
          <li>Demander à notre équipe sur place pendant votre séjour</li>
        </ul>
        <Button asChild>
          <Link href={`/${params.lang}/contact`}>
            Nous contacter
          </Link>
        </Button>
      </div>
    </div>
  );
}

const includedServices = [
  {
    title: "Wi-Fi haut débit",
    description: "Connexion internet haut débit gratuite dans toutes nos propriétés",
    icon: Wifi
  },
  {
    title: "Ménage quotidien",
    description: "Service de ménage quotidien pour garder votre espace impeccable",
    icon: Sparkles
  },
  {
    title: "Conciergerie 24/7",
    description: "Une équipe disponible 24h/24 et 7j/7 pour répondre à vos besoins",
    icon: Users
  },
  {
    title: "Sécurité",
    description: "Système de sécurité avancé et personnel de sécurité sur place",
    icon: Shield
  }
];

const premiumServices = [
  {
    title: "Chef privé",
    shortDescription: "Cuisine gastronomique à domicile",
    description: "Un chef expérimenté prépare des repas gastronomiques directement dans votre propriété, avec des ingrédients locaux et de saison.",
    price: "À partir de 150€ par repas",
    icon: Utensils
  },
  {
    title: "Chauffeur privé",
    shortDescription: "Transport personnalisé",
    description: "Service de chauffeur privé pour tous vos déplacements pendant votre séjour, avec véhicules de luxe disponibles.",
    price: "À partir de 80€ par heure",
    icon: Car
  },
  {
    title: "Organisation d'événements",
    shortDescription: "Célébrations sur mesure",
    description: "Organisation complète d'événements privés : anniversaires, mariages, réunions professionnelles ou fêtes familiales.",
    price: "Sur devis",
    icon: Users
  }
];
