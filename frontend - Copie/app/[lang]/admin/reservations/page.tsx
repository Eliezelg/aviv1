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
import { Edit, Trash, Check, X, Home, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import AdminNavigation from '@/app/[lang]/admin/components/AdminNavigation';

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  numberOfGuests: number;
  totalPrice: number;
  depositAmount: number;
  status: string;
  specialRequests?: string;
  confirmationCode: string;
  createdAt: string;
  updatedAt: string;
  property: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  paymentId?: string;
  paymentStatus?: string;
}

const AdminReservationsPage = ({ params }: { params: { lang: string } }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
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
        fetchReservations();
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        router.push(`/${params.lang}/login`);
      }
    };
    
    checkAuth();
  }, [router, toast, params.lang]);
  
  // Récupérer toutes les réservations
  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }
      
      console.log('Récupération des réservations...');
      console.log('URL:', 'http://localhost:5000/api/reservation/all');
      console.log('Token:', token.substring(0, 10) + '...');
      
      const response = await fetch('http://localhost:5000/api/reservation/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Statut de la réponse:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Réponse d\'erreur:', errorText);
        throw new Error(`Erreur lors de la récupération des réservations: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Données reçues:', data);
      
      if (Array.isArray(data)) {
        setReservations(data);
      } else {
        console.error('Format de données inattendu:', data);
        setReservations([]);
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de récupérer les réservations",
      });
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mettre à jour le statut d'une réservation
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/reservation/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }
      
      toast({
        title: "Succès",
        description: `Statut de la réservation mis à jour avec succès`,
      });
      
      // Actualiser la liste des réservations
      fetchReservations();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    }
  };
  
  // Supprimer une réservation
  const handleDeleteReservation = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/reservation/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la réservation');
      }
      
      toast({
        title: "Succès",
        description: "Réservation supprimée avec succès",
      });
      
      // Actualiser la liste des réservations
      fetchReservations();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la réservation",
      });
    }
  };
  
  // Filtrer les réservations en fonction de l'onglet actif
  const filteredReservations = reservations.filter(reservation => {
    if (activeTab === "all") return true;
    return reservation.status === activeTab.toUpperCase();
  });
  
  // Fonction pour afficher le statut avec le bon style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">En attente</Badge>;
      case 'CONFIRMED':
        return <Badge variant="default">Confirmée</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Annulée</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline">Terminée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
  };
  
  if (!isAuthenticated) {
    return <div className="container py-10">Vérification des droits d'accès...</div>;
  }
  
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Administration des réservations</h1>
        <Button variant="outline" asChild>
          <Link href={`/${params.lang}`}>
            <Home className="mr-2 h-4 w-4" />
            Retour au site
          </Link>
        </Button>
      </div>
      
      <AdminNavigation activeTab="reservations" lang={params.lang} />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Liste des réservations</CardTitle>
          <CardDescription>Gérez les réservations des clients</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {isLoading ? (
            <div className="text-center py-4">Chargement des réservations...</div>
          ) : filteredReservations.length === 0 ? (
            <div className="text-center py-4">Aucune réservation trouvée</div>
          ) : (
            <Table>
              <TableCaption>Liste des réservations</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Propriété</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.property.name}</TableCell>
                    <TableCell>
                      {reservation.user.firstName} {reservation.user.lastName}
                      <div className="text-xs text-muted-foreground">{reservation.user.email}</div>
                    </TableCell>
                    <TableCell>
                      {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                      <div className="text-xs text-muted-foreground">{reservation.numberOfGuests} personnes</div>
                    </TableCell>
                    <TableCell>
                      {reservation.totalPrice}€
                      <div className="text-xs text-muted-foreground">Acompte: {reservation.depositAmount}€</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                    <TableCell>
                      <Badge variant={reservation.paymentStatus === 'PAID' ? "default" : "secondary"}>
                        {reservation.paymentStatus === 'PAID' ? 'Payé' : 'En attente'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <Link href={`/fr/admin/reservations/${reservation.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        
                        {reservation.status === 'PENDING' && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleUpdateStatus(reservation.id, 'CONFIRMED')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {(reservation.status === 'PENDING' || reservation.status === 'CONFIRMED') && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleUpdateStatus(reservation.id, 'CANCELLED')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteReservation(reservation.id)}
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

export default AdminReservationsPage;
