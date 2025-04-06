"use client"

import * as React from "react"
import Link from "next/link"
import { Home, Phone, Image, Info, Building, User, Calendar, Bed, Utensils, Map } from "lucide-react"
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
import { useSiteConfig } from "@/hooks/useSiteConfig"

interface NavbarProps {
  lang: string;
  propertyId?: string;
}

export function Navbar({ lang, propertyId }: NavbarProps) {
  const { config, isLoading } = useSiteConfig();
  
  // Déterminer si nous sommes en mode mono-propriété
  const isSinglePropertyMode = !isLoading && config.singlePropertyMode;
  
  // Déterminer si nous sommes sur une page de propriété spécifique
  const isPropertyPage = !!propertyId;
  
  // ID de la propriété à utiliser (soit celle passée en prop, soit celle configurée en mode mono-propriété)
  const currentPropertyId = propertyId || (isSinglePropertyMode ? config.mainPropertyId : undefined);
  
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
        
        {/* Mode mono-propriété: afficher directement les liens de la propriété */}
        {isSinglePropertyMode && (
          <>
            <NavigationMenuItem>
              <Link href={`/${lang}/chambres`} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Bed className="mr-2 h-4 w-4" />
                  Chambres
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link href={`/${lang}/equipements`} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Utensils className="mr-2 h-4 w-4" />
                  Équipements
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link href={`/${lang}/activites`} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Map className="mr-2 h-4 w-4" />
                  Activités
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        )}
        
        {/* Mode multi-propriétés: afficher le menu À propos */}
        {!isSinglePropertyMode && !isPropertyPage && (
          <NavigationMenuItem>
            <Link href={`/${lang}/about`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Info className="mr-2 h-4 w-4" />
                À propos
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
        
        {/* Afficher le lien Propriétés uniquement en mode multi-propriétés et pas sur une page de propriété */}
        {!isSinglePropertyMode && !isPropertyPage && (
          <NavigationMenuItem>
            <Link href={`/${lang}/properties`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Building className="mr-2 h-4 w-4" />
                Propriétés
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
        
        {/* Sous-menu spécifique à une propriété en mode multi-propriétés */}
        {!isSinglePropertyMode && isPropertyPage && (
          <>
            <NavigationMenuItem>
              <Link href={`/${lang}/property/${currentPropertyId}/chambres`} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Bed className="mr-2 h-4 w-4" />
                  Chambres
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link href={`/${lang}/property/${currentPropertyId}/equipements`} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Utensils className="mr-2 h-4 w-4" />
                  Équipements
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link href={`/${lang}/property/${currentPropertyId}/activites`} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Map className="mr-2 h-4 w-4" />
                  Activités
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
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
          {isSinglePropertyMode ? (
            <Link href={`/${lang}/reservation`} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Calendar className="mr-2 h-4 w-4" />
                Réserver
              </NavigationMenuLink>
            </Link>
          ) : isPropertyPage ? (
            <Link href={`/${lang}/property/${currentPropertyId}/reservation`} legacyBehavior passHref>
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