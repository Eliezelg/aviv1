"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash, Plus, Home } from "lucide-react";
import AdminNavigation from '@/app/[lang]/admin/components/AdminNavigation';

interface Property {
  id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerNight: number;
  images: string[];
  amenities: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  reservations: {
    id: string;
  }[];
}

const AdminPropertiesPage = ({ params }: { params: { lang: string } }) => {
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
        fetchProperties();
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        router.push(`/${params.lang}/login`);
      }
    };
    
    checkAuth();
  }, [router, toast, params.lang]);
  
  // Récupérer toutes les propriétés
  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/property', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des propriétés');
      }
      
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les propriétés",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Supprimer une propriété
  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/property/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la propriété');
      }
      
      toast({
        title: "Succès",
        description: "Propriété supprimée avec succès",
      });
      
      // Actualiser la liste des propriétés
      fetchProperties();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la propriété",
      });
    }
  };
  
  // Mettre à jour la disponibilité d'une propriété
  const handleToggleAvailability = async (id: string, isCurrentlyAvailable: boolean) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/property/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isAvailable: !isCurrentlyAvailable
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la disponibilité');
      }
      
      toast({
        title: "Succès",
        description: `Propriété ${!isCurrentlyAvailable ? 'activée' : 'désactivée'} avec succès`,
      });
      
      // Actualiser la liste des propriétés
      fetchProperties();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la disponibilité",
      });
    }
  };
  
  if (!isAuthenticated) {
    return <div className="container py-10">Vérification des droits d'accès...</div>;
  }
  
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Administration des propriétés</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${params.lang}`}>
              <Home className="mr-2 h-4 w-4" />
              Retour au site
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/${params.lang}/admin/properties/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une propriété
            </Link>
          </Button>
        </div>
      </div>
      
      <AdminNavigation activeTab="properties" lang={params.lang} />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Liste des propriétés</CardTitle>
          <CardDescription>Gérez les propriétés disponibles sur le site</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Chargement des propriétés...</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-4">Aucune propriété trouvée</div>
          ) : (
            <Table>
              <TableCaption>Liste des propriétés disponibles</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Capacité</TableHead>
                  <TableHead>Prix/Nuit</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Réservations</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.name}</TableCell>
                    <TableCell>{property.capacity} personnes</TableCell>
                    <TableCell>{property.pricePerNight}€</TableCell>
                    <TableCell>
                      <Badge variant={property.isAvailable ? "default" : "secondary"}>
                        {property.isAvailable ? 'Disponible' : 'Non disponible'}
                      </Badge>
                    </TableCell>
                    <TableCell>{property.reservations?.length || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleAvailability(property.id, property.isAvailable)}
                        >
                          {property.isAvailable ? 'Désactiver' : 'Activer'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <Link href={`/${params.lang}/admin/properties/edit/${property.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPropertiesPage;
