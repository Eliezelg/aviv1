import { Request, Response } from 'express';
import * as reservationService from '../services/reservationService';

/**
 * Crée une nouvelle réservation
 */
export const createReservation = async (req: Request, res: Response) => {
  try {
    const { 
      startDate, 
      endDate, 
      numberOfGuests, 
      specialRequests, 
      propertyId,
      guestEmail,
      guestFirstName,
      guestLastName,
      frontendUrl
    } = req.body;

    // Vérifier les données requises
    if (!startDate || !endDate || !numberOfGuests || !propertyId || !guestEmail || !frontendUrl) {
      return res.status(400).json({ 
        message: 'Veuillez fournir toutes les informations requises' 
      });
    }

    // Créer la réservation avec ou sans utilisateur connecté
    const userId = req.user ? req.user.id : undefined;
    
    const result = await reservationService.createReservation({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      numberOfGuests,
      specialRequests,
      userId,
      propertyId,
      guestEmail,
      guestFirstName,
      guestLastName,
      frontendUrl
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupère toutes les réservations (admin)
 */
export const getAllReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await reservationService.getAllReservations();
    res.status(200).json(reservations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupère les réservations de l'utilisateur connecté
 */
export const getUserReservations = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    
    const reservations = await reservationService.getUserReservations(req.user.id);
    res.status(200).json(reservations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupère les réservations par email et code de confirmation (pour les utilisateurs non inscrits)
 */
export const getReservationsByEmail = async (req: Request, res: Response) => {
  try {
    const { email, confirmationCode } = req.body;
    
    if (!email || !confirmationCode) {
      return res.status(400).json({ 
        message: 'Veuillez fournir un email et un code de confirmation' 
      });
    }
    
    const reservations = await reservationService.getReservationsByEmailAndCode(email, confirmationCode);
    
    if (reservations.length === 0) {
      return res.status(404).json({ 
        message: 'Aucune réservation trouvée pour cet email et ce code de confirmation' 
      });
    }
    
    res.status(200).json(reservations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupère une réservation par son ID
 */
export const getReservationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'ID de réservation requis' });
    }
    
    const reservation = await reservationService.getReservationById(id);
    
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    
    // Vérifier si l'utilisateur est autorisé à voir cette réservation
    if (req.user && req.user.role !== 'ADMIN' && reservation.userId !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé à voir cette réservation' });
    }
    
    res.status(200).json(reservation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupère une réservation par son code de confirmation
 */
export const getReservationByConfirmationCode = async (req: Request, res: Response) => {
  try {
    const { confirmationCode } = req.params;
    
    if (!confirmationCode) {
      return res.status(400).json({ message: 'Code de confirmation requis' });
    }
    
    const reservation = await reservationService.getReservationByConfirmationCode(confirmationCode);
    
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    
    res.status(200).json(reservation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Annule une réservation
 */
export const cancelReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'ID de réservation requis' });
    }
    
    // Vérifier si la réservation existe
    const existingReservation = await reservationService.getReservationById(id);
    
    if (!existingReservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    
    // Vérifier si l'utilisateur est autorisé à annuler cette réservation
    if (req.user && req.user.role !== 'ADMIN' && existingReservation.userId !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé à annuler cette réservation' });
    }
    
    const reservation = await reservationService.cancelReservation(id);
    res.status(200).json(reservation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Met à jour le statut d'une réservation (admin)
 */
export const updateReservationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!id || !status) {
      return res.status(400).json({ message: 'ID de réservation et statut requis' });
    }
    
    const reservation = await reservationService.updateReservationStatus(id, status);
    res.status(200).json(reservation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
