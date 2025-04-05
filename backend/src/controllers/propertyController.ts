import { Request, Response } from 'express';
import * as propertyService from '../services/propertyService';

export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const properties = await propertyService.getAllProperties();
    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await propertyService.getPropertyById(req.params.id);
    res.json(property);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const createProperty = async (req: Request, res: Response) => {
  try {
    const { name, description, capacity, pricePerNight, images, amenities } = req.body;

    if (!name || !description || !capacity || !pricePerNight) {
      res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires' });
      return;
    }

    const property = await propertyService.createProperty({
      name,
      description,
      capacity: Number(capacity),
      pricePerNight: Number(pricePerNight),
      images: images || [],
      amenities: amenities || []
    });

    res.status(201).json(property);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const property = await propertyService.updateProperty(req.params.id, req.body);
    res.json(property);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    await propertyService.deleteProperty(req.params.id);
    res.json({ message: 'Propriété supprimée avec succès' });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const checkPropertyAvailability = async (req: Request, res: Response) => {
  try {
    const { propertyId, startDate, endDate } = req.body;

    if (!propertyId || !startDate || !endDate) {
      res.status(400).json({ message: 'Veuillez fournir toutes les informations nécessaires' });
      return;
    }

    const isAvailable = await propertyService.checkPropertyAvailability(
      propertyId,
      new Date(startDate),
      new Date(endDate)
    );

    res.json({ isAvailable });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Récupère toutes les dates indisponibles pour une propriété
 */
export const getUnavailableDates = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;

    if (!propertyId) {
      res.status(400).json({ message: 'Veuillez fournir l\'ID de la propriété' });
      return;
    }

    const unavailableDates = await propertyService.getUnavailableDates(propertyId);
    res.json(unavailableDates);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
