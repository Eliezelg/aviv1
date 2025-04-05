import express from 'express';
import { getSiteConfig, updateSiteConfig } from '../controllers/siteConfigController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

// Route publique pour récupérer la configuration
router.get('/', getSiteConfig);

// Route protégée pour mettre à jour la configuration (admin uniquement)
router.post('/', protect, admin, updateSiteConfig);

export default router;
