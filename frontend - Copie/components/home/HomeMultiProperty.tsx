"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Waves, Film, Award, Utensils, Palmtree, Car } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

interface HomeMultiPropertyProps {
  lang: string;
  dict: any;
}

const HomeMultiProperty = ({ lang, dict }: HomeMultiPropertyProps) => {
  return (
    <main className="min-h-screen">
      <div className="relative h-[100vh]">
        <Image
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=3271&auto=format&fit=crop"
          alt="Villa Aviv"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0">
          <div className="container mx-auto px-4">
            <div className="py-4">
              <Navbar lang={lang} />
            </div>
            <div className="flex h-[80vh] items-center justify-start">
              <div className="max-w-2xl text-white">
                <h1 className="mb-6 text-5xl font-bold">Villa Aviv</h1>
                <div className="mb-8 text-xl">
                  {dict.home.hero_description || "Une sélection de propriétés exceptionnelles pour vos séjours."}
                </div>
                <div className="flex gap-4">
                  <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
                    <Link href={`/${lang}/properties`}>
                      {dict.common.view_properties || "Voir nos propriétés"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                    <Link href={`/${lang}/about`}>
                      {dict.common.learn_more || "En savoir plus"}
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
          <h2 className="mb-12 text-center text-3xl font-bold">{dict.home.features_title || "Nos Prestations"}</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="rounded-lg border p-6">
                <feature.icon className="mb-4 h-8 w-8" />
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <div className="text-muted-foreground">{feature.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

const features = [
  {
    title: "Piscine Intérieure",
    description: "Piscine chauffée à 29°C toute l'année avec pataugeoire pour enfants",
    icon: Waves,
  },
  {
    title: "Salle de Cinéma",
    description: "Écran géant et installation sonore professionnelle pour 50 personnes",
    icon: Film,
  },
  {
    title: "Installations Sportives",
    description: "Terrains de tennis et de basket-ball pour vos activités sportives",
    icon: Award,
  },
  {
    title: "Cuisine Professionnelle",
    description: "Cuisine entièrement équipée pour vos réceptions",
    icon: Utensils,
  },
  {
    title: "Espaces Extérieurs",
    description: "Grands jardins, terrasse, four à pizza et barbecues",
    icon: Palmtree,
  },
  {
    title: "Facilité d'Accès",
    description: "Parking gratuit pour 15 voitures et proximité de la gare SNCF",
    icon: Car,
  },
];

export default HomeMultiProperty;
