
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
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { School as Pool, Clapperboard, Trophy, Utensils, Trees, Wifi, Tv, Coffee, Bath, Car } from "lucide-react"
import Image from "next/image"
import { getDictionary } from "@/lib/dictionary"

const iconMap = {
  Pool,
  Clapperboard,
  Trophy,
  Utensils,
  Coffee,
  Wifi,
  Tv,
  Bath,
  Car,
  Trees
}

export default async function EquipementsPage({
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
          <h1 className="mb-2 text-4xl font-bold">{dict.equipment.title}</h1>
          <p className="mb-12 text-xl text-muted-foreground">
            {dict.equipment.description}
          </p>

          <Tabs defaultValue="indoor" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="indoor">{dict.equipment.tabs.indoor}</TabsTrigger>
              <TabsTrigger value="outdoor">{dict.equipment.tabs.outdoor}</TabsTrigger>
            </TabsList>

            <TabsContent value="indoor" className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                {dict.equipment.indoor.main.map((item, index) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap]
                  return (
                    <Card key={index} className="overflow-hidden">
                      <AspectRatio ratio={16/9}>
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <h3 className="text-xl font-semibold">{item.title}</h3>
                        </div>
                        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                          {item.features.map((feature, featureIndex) => (
                            <li key={featureIndex}>{feature}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card className="p-6">
                <h3 className="mb-6 text-xl font-semibold">{dict.equipment.indoor.other.title}</h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {dict.equipment.indoor.other.items.map((item, index) => {
                    const Icon = iconMap[item.icon as keyof typeof iconMap]
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="outdoor" className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                {dict.equipment.outdoor.main.map((item, index) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap]
                  return (
                    <Card key={index} className="overflow-hidden">
                      <AspectRatio ratio={16/9}>
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </AspectRatio>
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <h3 className="text-xl font-semibold">{item.title}</h3>
                        </div>
                        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                          {item.features.map((feature, featureIndex) => (
                            <li key={featureIndex}>{feature}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card className="p-6">
                <h3 className="mb-6 text-xl font-semibold">{dict.equipment.outdoor.other.title}</h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {dict.equipment.outdoor.other.items.map((item, index) => {
                    const Icon = iconMap[item.icon as keyof typeof iconMap]
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}