import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  throw new Error('La clé API Stripe n\'est pas définie dans les variables d\'environnement');
}

const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16' as any,
});

/**
 * Crée une session de paiement Stripe pour un acompte de réservation
 */
export const createPaymentSession = async (
  reservationId: string,
  amount: number,
  customerEmail: string,
  propertyName: string,
  successUrl: string,
  cancelUrl: string
) => {
  try {
    // Récupérer les détails de la réservation
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { property: true },
    });

    if (!reservation) {
      throw new Error('Réservation non trouvée');
    }

    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Acompte pour ${propertyName}`,
              description: `Réservation du ${new Date(reservation.startDate).toLocaleDateString()} au ${new Date(reservation.endDate).toLocaleDateString()}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe utilise les centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&reservation_id=${reservationId}`,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
    });

    // Mettre à jour la réservation avec l'ID de session Stripe
    await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        stripePaymentId: session.id,
      },
    });

    return { url: session.url, sessionId: session.id };
  } catch (error: any) {
    console.error('Erreur lors de la création de la session de paiement:', error.message);
    throw new Error(`Erreur lors de la création de la session de paiement: ${error.message}`);
  }
};

/**
 * Vérifie le statut d'un paiement Stripe
 */
export const checkPaymentStatus = async (sessionId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Mettre à jour la réservation avec le statut de paiement
      const reservation = await prisma.reservation.findFirst({
        where: { stripePaymentId: sessionId },
      });

      if (reservation) {
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: {
            depositPaid: true,
            status: 'CONFIRMED',
          },
        });
      }

      return { paid: true, session };
    }

    return { paid: false, session };
  } catch (error: any) {
    console.error('Erreur lors de la vérification du statut de paiement:', error.message);
    throw new Error(`Erreur lors de la vérification du statut de paiement: ${error.message}`);
  }
};

/**
 * Gère le webhook Stripe pour les événements de paiement
 */
export const handleStripeWebhook = async (signature: string, payload: Buffer) => {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      throw new Error('La clé secrète du webhook Stripe n\'est pas définie');
    }

    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Mettre à jour la réservation avec le statut de paiement
      const reservation = await prisma.reservation.findFirst({
        where: { stripePaymentId: session.id },
      });

      if (reservation) {
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: {
            depositPaid: true,
            status: 'CONFIRMED',
          },
        });
      }
    }

    return { received: true };
  } catch (error: any) {
    console.error('Erreur lors du traitement du webhook Stripe:', error.message);
    throw new Error(`Erreur lors du traitement du webhook Stripe: ${error.message}`);
  }
};
