"use client"

import * as React from "react"
import Link from "next/link"
import { Home, Phone, Image, Info, Building, User, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useParams } from "next/navigation"
import { useSiteConfig } from "@/hooks/useSiteConfig"

interface NavbarProps {
  lang: string;
}

export function Navbar({ lang }: NavbarProps) {
  const { config, isLoading } = useSiteConfig();
  
  return (
    <NavigationMenu className="max-w-screen-xl mx-auto">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={`/${lang}`} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>La Villa</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <Link href={`/${lang}/chambres`} className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                  <div className="mb-2 mt-4 text-lg font-medium">
                    Chambres
                  </div>
                  <p className="text-sm leading-tight text-muted-foreground">
                    15 chambres luxueuses réparties sur trois niveaux
                  </p>
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/equipements`} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="text-sm font-medium leading-none">Équipements</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Piscine, cinéma, salle de réunion et plus
                  </p>
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/activites`} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="text-sm font-medium leading-none">Activités</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Découvrez les activités à proximité
                  </p>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        {/* Afficher le lien Propriétés uniquement en mode multi-propriétés */}
        {!isLoading && !config.singlePropertyMode && (
          <NavigationMenuItem>
            <Link href={`/${lang}/properties`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Building className="mr-2 h-4 w-4" />
                Propriétés
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
        
        <NavigationMenuItem>
          <Link href={`/${lang}/galerie`} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Image className="mr-2 h-4 w-4" />
              Galerie
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link href={`/${lang}/contact`} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Phone className="mr-2 h-4 w-4" />
              Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        {/* Adapter le lien de réservation selon le mode */}
        <NavigationMenuItem>
          {!isLoading && config.singlePropertyMode ? (
            <Link href={`/${lang}/reservation`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Calendar className="mr-2 h-4 w-4" />
                Réserver
              </NavigationMenuLink>
            </Link>
          ) : (
            <Link href={`/${lang}/reservation/guest`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <User className="mr-2 h-4 w-4" />
                Mes réservations
              </NavigationMenuLink>
            </Link>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}