import express from 'express';
import * as paymentController from '../controllers/paymentController';

const router = express.Router();

// Route pour créer une session de paiement
router.post('/create-session', paymentController.createPaymentSession);

// Route pour vérifier le statut d'un paiement
router.get('/check/:sessionId', paymentController.checkPaymentStatus);

// Route pour le webhook Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);

export default router;
