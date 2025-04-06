
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
import { Gallery } from "react-photoswipe-gallery"
import 'photoswipe/dist/photoswipe.css'
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import { getDictionary } from "@/lib/dictionary"

export default async function GaleriePage({
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
          <h1 className="mb-2 text-4xl font-bold">{dict.gallery.title}</h1>
          <p className="mb-12 text-xl text-muted-foreground">
            {dict.gallery.description}
          </p>

          <Gallery>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {dict.gallery.images.map((image, index) => (
                <div
                  key={index}
                  className="group relative cursor-zoom-in overflow-hidden rounded-lg"
                >
                  <AspectRatio ratio={4/3}>
                    <Image
                      src={image.thumbnail}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-black/40 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-sm text-white">{image.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </Gallery>
        </div>
      </div>
    </main>
  )
}