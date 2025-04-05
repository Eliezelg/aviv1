import { PrismaClient } from '@prisma/client';
import * as propertyService from './propertyService';
import * as paymentService from './paymentService';

const prisma = new PrismaClient();

/**
 * Crée une nouvelle réservation
 */
export const createReservation = async (reservationData: {
  startDate: Date;
  endDate: Date;
  numberOfGuests: number;
  specialRequests?: string;
  userId?: string; // Optionnel pour les réservations sans inscription
  propertyId: string;
  guestEmail: string; // Email du client (obligatoire même sans inscription)
  guestFirstName?: string; // Prénom du client (pour les réservations sans inscription)
  guestLastName?: string; // Nom du client (pour les réservations sans inscription)
  frontendUrl: string; // URL du frontend pour les redirections Stripe
}) => {
  // Vérifier si la propriété est disponible pour les dates sélectionnées
  const isAvailable = await propertyService.checkPropertyAvailability(
    reservationData.propertyId,
    reservationData.startDate,
    reservationData.endDate
  );

  if (!isAvailable) {
    throw new Error('La propriété n\'est pas disponible pour les dates sélectionnées');
  }

  // Récupérer les détails de la propriété
  const property = await prisma.property.findUnique({
    where: { id: reservationData.propertyId },
  });

  if (!property) {
    throw new Error('Propriété non trouvée');
  }

  // Calculer le nombre de nuits
  const nights = Math.ceil(
    (reservationData.endDate.getTime() - reservationData.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculer le prix total
  const totalPrice = nights * property.pricePerNight;
  
  // Calculer le montant de l'acompte (30% du prix total)
  const depositAmount = Math.round(totalPrice * 0.3 * 100) / 100;

  // Si l'utilisateur n'est pas inscrit, créer un utilisateur temporaire
  let userId = reservationData.userId;
  
  if (!userId && reservationData.guestFirstName && reservationData.guestLastName) {
    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: reservationData.guestEmail },
    });

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Créer un nouvel utilisateur sans mot de passe
      const newUser = await prisma.user.create({
        data: {
          email: reservationData.guestEmail,
          firstName: reservationData.guestFirstName,
          lastName: reservationData.guestLastName,
        },
      });
      userId = newUser.id;
    }
  }

  // Créer la réservation
  const reservation = await prisma.reservation.create({
    data: {
      startDate: reservationData.startDate,
      endDate: reservationData.endDate,
      numberOfGuests: reservationData.numberOfGuests,
      specialRequests: reservationData.specialRequests,
      totalPrice,
      depositAmount,
      guestEmail: reservationData.guestEmail,
      userId,
      propertyId: reservationData.propertyId,
    },
  });

  // Créer une session de paiement Stripe pour l'acompte
  const successUrl = `${reservationData.frontendUrl}/reservation/confirmation/${reservation.id}`;
  const cancelUrl = `${reservationData.frontendUrl}/reservation/cancel/${reservation.id}`;

  const paymentSession = await paymentService.createPaymentSession(
    reservation.id,
    depositAmount,
    reservationData.guestEmail,
    property.name,
    successUrl,
    cancelUrl
  );

  return {
    reservation,
    paymentUrl: paymentSession.url,
  };
};

/**
 * Récupère toutes les réservations
 */
export const getAllReservations = async () => {
  return await prisma.reservation.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

/**
 * Récupère les réservations d'un utilisateur
 */
export const getUserReservations = async (userId: string) => {
  return await prisma.reservation.findMany({
    where: {
      userId,
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          images: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Récupère les réservations par email (pour les utilisateurs non inscrits)
 */
export const getReservationsByEmail = async (email: string) => {
  return await prisma.reservation.findMany({
    where: {
      guestEmail: email,
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          images: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Récupère une réservation par son ID
 */
export const getReservationById = async (id: string) => {
  return await prisma.reservation.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          name: true,
          images: true,
        },
      },
    },
  });
};

/**
 * Récupère une réservation par son code de confirmation
 */
export const getReservationByConfirmationCode = async (confirmationCode: string) => {
  return await prisma.reservation.findUnique({
    where: {
      confirmationCode,
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          images: true,
        },
      },
    },
  });
};

/**
 * Récupère les réservations par email et code de confirmation
 */
export const getReservationsByEmailAndCode = async (email: string, confirmationCode: string) => {
  // Vérifier d'abord si le code de confirmation est valide
  const validReservation = await getReservationByConfirmationCode(confirmationCode);
  
  if (!validReservation || validReservation.guestEmail !== email) {
    return [];
  }
  
  // Si le code est valide pour cet email, récupérer toutes les réservations de cet email
  return await prisma.reservation.findMany({
    where: {
      guestEmail: email
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          images: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

/**
 * Annule une réservation
 */
export const cancelReservation = async (id: string) => {
  // Vérifier si la réservation existe
  const reservation = await prisma.reservation.findUnique({
    where: { id },
  });

  if (!reservation) {
    throw new Error('Réservation non trouvée');
  }

  // Vérifier si la réservation peut être annulée
  if (!['PENDING', 'CONFIRMED'].includes(reservation.status)) {
    throw new Error('Cette réservation ne peut pas être annulée');
  }

  // Annuler la réservation
  return await prisma.reservation.update({
    where: { id },
    data: {
      status: 'CANCELLED',
    },
  });
};

/**
 * Met à jour le statut d'une réservation
 */
export const updateReservationStatus = async (id: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
  // Vérifier si la réservation existe
  const reservation = await prisma.reservation.findUnique({
    where: { id },
  });

  if (!reservation) {
    throw new Error('Réservation non trouvée');
  }

  // Mettre à jour le statut
  return await prisma.reservation.update({
    where: { id },
    data: {
      status,
    },
  });
};
