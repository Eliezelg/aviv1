import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
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
    title: 'À propos de Villa Aviv',
    description: 'Découvrez l\'histoire et les valeurs de Villa Aviv',
  };
}

export default async function AboutPage({ params }: { params: { lang: string } }) {
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
      
      <h1 className="text-4xl font-bold mb-6">À propos de Villa Aviv</h1>
      
      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <div>
          <p className="text-lg mb-4">
            Villa Aviv est une entreprise spécialisée dans la location de propriétés exceptionnelles pour des séjours inoubliables.
          </p>
          <p className="mb-4">
            Fondée en 2015, notre mission est de proposer des lieux d'exception alliant confort, luxe et authenticité pour des vacances, des événements professionnels ou des célébrations familiales.
          </p>
          <p>
            Nous sélectionnons avec soin chacune de nos propriétés pour garantir à nos clients une expérience unique dans des cadres privilégiés.
          </p>
        </div>
        <div className="relative h-[300px] rounded-lg overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=3270&auto=format&fit=crop" 
            alt="Villa Aviv" 
            fill 
            className="object-cover"
          />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Nos valeurs</h2>
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Excellence</h3>
          <p>Nous visons l'excellence dans tous nos services, de la sélection des propriétés à l'accueil de nos clients.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Authenticité</h3>
          <p>Nous privilégions des lieux authentiques qui reflètent le caractère unique de chaque région.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Personnalisation</h3>
          <p>Nous adaptons nos services aux besoins spécifiques de chaque client pour une expérience sur mesure.</p>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Notre équipe</h2>
      <p className="mb-6">
        Notre équipe passionnée est composée de professionnels du tourisme et de l'hôtellerie de luxe, tous dédiés à rendre votre séjour exceptionnel.
      </p>
      <div className="grid gap-6 md:grid-cols-4">
        <div className="text-center">
          <div className="relative h-[200px] w-[200px] mx-auto rounded-full overflow-hidden mb-4">
            <Image 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=3149&auto=format&fit=crop" 
              alt="Directeur" 
              fill 
              className="object-cover"
            />
          </div>
          <h3 className="font-semibold">Thomas Durand</h3>
          <p className="text-muted-foreground">Directeur</p>
        </div>
        <div className="text-center">
          <div className="relative h-[200px] w-[200px] mx-auto rounded-full overflow-hidden mb-4">
            <Image 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=3276&auto=format&fit=crop" 
              alt="Responsable des réservations" 
              fill 
              className="object-cover"
            />
          </div>
          <h3 className="font-semibold">Sophie Martin</h3>
          <p className="text-muted-foreground">Responsable des réservations</p>
        </div>
        <div className="text-center">
          <div className="relative h-[200px] w-[200px] mx-auto rounded-full overflow-hidden mb-4">
            <Image 
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=3387&auto=format&fit=crop" 
              alt="Responsable des propriétés" 
              fill 
              className="object-cover"
            />
          </div>
          <h3 className="font-semibold">Marc Dubois</h3>
          <p className="text-muted-foreground">Responsable des propriétés</p>
        </div>
        <div className="text-center">
          <div className="relative h-[200px] w-[200px] mx-auto rounded-full overflow-hidden mb-4">
            <Image 
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3361&auto=format&fit=crop" 
              alt="Service client" 
              fill 
              className="object-cover"
            />
          </div>
          <h3 className="font-semibold">Julie Leroy</h3>
          <p className="text-muted-foreground">Service client</p>
        </div>
      </div>
    </div>
  );
}
