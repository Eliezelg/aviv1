"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Home } from "lucide-react";
import AdminNavigation from '@/app/[lang]/admin/components/AdminNavigation';

interface Property {
  id: string;
  name: string;
}

const SiteConfigPage = ({ params }: { params: { lang: string } }) => {
  const [singlePropertyMode, setSinglePropertyMode] = useState(false);
  const [mainPropertyId, setMainPropertyId] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Vérifier l'authentification de l'administrateur
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push(`/${params.lang}/login`);
          return;
        }
        
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (!response.ok || data.role !== 'ADMIN') {
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Vous devez être administrateur pour accéder à cette page",
          });
          router.push(`/${params.lang}`);
          return;
        }
        
        setIsAuthenticated(true);
        fetchData();
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        router.push(`/${params.lang}/login`);
      }
    };
    
    checkAuth();
  }, [router, toast, params.lang]);

  // Charger la configuration actuelle et les propriétés
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Charger la configuration
      const configResponse = await fetch('http://localhost:5000/api/site-config');
      
      if (!configResponse.ok) {
        throw new Error('Erreur lors du chargement de la configuration');
      }
      
      const configData = await configResponse.json();
      
      setSinglePropertyMode(configData.singlePropertyMode || false);
      setMainPropertyId(configData.mainPropertyId || "");
      
      // Charger les propriétés
      const propertiesResponse = await fetch('http://localhost:5000/api/property');
      
      if (!propertiesResponse.ok) {
        throw new Error('Erreur lors du chargement des propriétés');
      }
      
      const propertiesData = await propertiesResponse.json();
      
      setProperties(propertiesData);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarder la configuration
  const saveConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/site-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          singlePropertyMode,
          mainPropertyId: singlePropertyMode ? mainPropertyId : null
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde de la configuration');
      }
      
      toast({
        title: "Succès",
        description: "Configuration mise à jour avec succès",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration",
      });
    }
  };

  if (!isAuthenticated) {
    return <div className="container py-10">Vérification des droits d'accès...</div>;
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Configuration du site</h1>
        <Button variant="outline" asChild>
          <Link href={`/${params.lang}`}>
            <Home className="mr-2 h-4 w-4" />
            Retour au site
          </Link>
        </Button>
      </div>
      
      <AdminNavigation activeTab="site-config" lang={params.lang} />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Mode de fonctionnement</CardTitle>
          <CardDescription>Configurez le mode de fonctionnement du site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center py-4">Chargement de la configuration...</div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Mode mono-propriété</h3>
                  <p className="text-sm text-muted-foreground">
                    Activez cette option si votre site ne gère qu'une seule propriété
                  </p>
                </div>
                <Switch 
                  checked={singlePropertyMode} 
                  onCheckedChange={setSinglePropertyMode} 
                />
              </div>
              
              {singlePropertyMode && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Propriété principale</h3>
                  <Select 
                    value={mainPropertyId} 
                    onValueChange={setMainPropertyId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une propriété" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <Button onClick={saveConfig} className="mt-4">
                Enregistrer la configuration
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteConfigPage;
