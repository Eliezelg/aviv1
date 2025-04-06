
// Cette fonction est requise pour la génération statique avec des routes dynamiques
export function generateStaticParams() {
  // Définir les chemins de langue à pré-rendre
  return [
    { lang: 'fr' },
    { lang: 'en' },
    { lang: 'de' }
  ];
}
"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bed, Users, Bath, Maximize } from "lucide-react"
import Image from "next/image"
import { getDictionary } from "@/lib/dictionary"

export default async function ChambresPage({
  params: { lang }
}: {
  params: { lang: string }
}) {
  const dict = await getDictionary(lang)

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="py-4">
          <Navbar lang={lang} />
        </div>
        
        <div className="py-12">
          <h1 className="mb-2 text-4xl font-bold">{dict.rooms.title}</h1>
          <p className="mb-12 text-xl text-muted-foreground">
            {dict.rooms.description}
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {dict.rooms.list.map((room, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{room.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{room.capacity} {dict.rooms.people}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{room.beds}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{room.bathroom}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{room.size}m²</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{room.description}</p>
                  <ul className="mt-4 space-y-2">
                    {room.amenities.map((amenity, index) => (
                      <li key={index} className="text-sm">• {amenity}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}