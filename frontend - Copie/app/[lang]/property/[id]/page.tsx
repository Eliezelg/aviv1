import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import PropertyDetail from '@/components/property/PropertyDetail';
import { getDictionary } from '@/lib/dictionary';
import { Navbar } from "@/components/navbar";

// Cette fonction est requise pour la génération statique avec des routes dynamiques
export async function generateStaticParams() {
  // Récupérer les IDs des propriétés depuis l'API
  try {
    const response = await fetch('http://localhost:5000/api/property');
    const properties = await response.json();
    const propertyIds = properties.map((property: any) => property.id);
    
    // Ajouter l'ID spécifique qui cause l'erreur
    if (!propertyIds.includes('123445678')) {
      propertyIds.push('123445678');
    }
    
    // Ajouter les IDs des propriétés de test
    if (!propertyIds.includes('villa-mediterranee')) {
      propertyIds.push('villa-mediterranee');
    }
    if (!propertyIds.includes('chalet-alpin')) {
      propertyIds.push('chalet-alpin');
    }
    if (!propertyIds.includes('appartement-parisien')) {
      propertyIds.push('appartement-parisien');
    }
    
    const langs = ['fr', 'en', 'de'];
    
    return langs.flatMap(lang => 
      propertyIds.map(id => ({
        lang,
        id
      }))
    );
  } catch (error) {
    // En cas d'erreur, retourner au moins les paramètres pour les langues et l'ID problématique
    const langs = ['fr', 'en', 'de'];
    const ids = ['123445678', 'villa-mediterranee', 'chalet-alpin', 'appartement-parisien'];
    
    return langs.flatMap(lang => 
      ids.map(id => ({
        lang,
        id
      }))
    );
  }
}

interface PropertyPageProps {
  params: {
    lang: string;
    id: string; // Ajout du type explicite
  };
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  try {
    // Récupérer les détails de la propriété pour le titre de la page
    const response = await fetch(`http://localhost:5000/api/property/${params.id}`);
    const property = await response.json();
    
    return {
      title: `${property.name} - Villa Aviv`,
      description: `Réservez votre séjour à ${property.name}`,
    };
  } catch (error) {
    return {
      title: 'Détails de la propriété - Villa Aviv',
      description: 'Réservez votre séjour à Villa Aviv',
    };
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const dict = await getDictionary(params.lang);
  
  return (
    <div>
      <div className="container py-4">
        <Navbar lang={params.lang} propertyId={params.id} />
      </div>
      
      <div className="container py-10">
        <div className="mb-6">
          <Link href={`/${params.lang}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft size={16} />
              {dict.common.back_to_home}
            </Button>
          </Link>
        </div>
        
        <PropertyDetail propertyId={params.id} lang={params.lang} />
      </div>
    </div>
  );
}
