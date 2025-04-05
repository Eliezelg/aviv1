import express from 'express';
import * as propertyController from '../controllers/propertyController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);
router.post('/', protect, admin, propertyController.createProperty);
router.put('/:id', protect, admin, propertyController.updateProperty);
router.delete('/:id', protect, admin, propertyController.deleteProperty);
router.post('/check-availability', propertyController.checkPropertyAvailability);
router.get('/:propertyId/unavailable-dates', propertyController.getUnavailableDates);

export default router;
