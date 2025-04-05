import express from 'express';
import * as reservationController from '../controllers/reservationController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

// Créer une réservation (avec ou sans inscription)
router.post('/', reservationController.createReservation);

// Obtenir toutes les réservations (admin)
router.get('/all', protect, admin, reservationController.getAllReservations);

// Obtenir les réservations de l'utilisateur connecté
router.get('/me', protect, reservationController.getUserReservations);

// Obtenir les réservations par email et code de confirmation (pour les utilisateurs non inscrits)
router.post('/guest', reservationController.getReservationsByEmail);

// Obtenir une réservation par son code de confirmation
router.get('/confirmation/:confirmationCode', reservationController.getReservationByConfirmationCode);

// Obtenir une réservation par son ID
router.get('/:id', reservationController.getReservationById);

// Annuler une réservation
router.put('/:id/cancel', reservationController.cancelReservation);

// Mettre à jour le statut d'une réservation (admin)
router.put('/:id/status', protect, admin, reservationController.updateReservationStatus);

export default router;
