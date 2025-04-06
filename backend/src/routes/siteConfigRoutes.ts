import express from 'express';
import { getSiteConfig } from '../controllers/siteConfigController';

const router = express.Router();

// Route publique pour récupérer la configuration
router.get('/', getSiteConfig);

export default router;
