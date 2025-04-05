import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as paymentService from '../services/paymentService';

const prisma = new PrismaClient();

/**
 * Crée une session de paiement Stripe
 */
export const createPaymentSession = async (req: Request, res: Response) => {
  try {
    const { reservationId, frontendUrl } = req.body;

    if (!reservationId || !frontendUrl) {
      return res.status(400).json({ message: 'ID de réservation et URL du frontend requis' });
    }

    // Récupérer les détails de la réservation depuis la base de données
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { property: true },
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    const successUrl = `${frontendUrl}/reservation/confirmation/${reservationId}`;
    const cancelUrl = `${frontendUrl}/reservation/cancel/${reservationId}`;

    const session = await paymentService.createPaymentSession(
      reservationId,
      reservation.depositAmount,
      reservation.guestEmail,
      reservation.property.name,
      successUrl,
      cancelUrl
    );

    res.status(200).json({ url: session.url, sessionId: session.sessionId });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Vérifie le statut d'un paiement Stripe
 */
export const checkPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ message: 'ID de session requis' });
    }

    const result = await paymentService.checkPaymentStatus(sessionId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Gère le webhook Stripe pour les événements de paiement
 */
export const handleStripeWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    
    if (!signature) {
      return res.status(400).json({ message: 'Signature Stripe manquante' });
    }

    await paymentService.handleStripeWebhook(signature, req.body);
    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Erreur webhook:', error.message);
    res.status(400).json({ message: error.message });
  }
};
