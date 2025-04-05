import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const CONFIG_ID = 'default';

// Récupérer la configuration du site
export const getSiteConfig = async (req: Request, res: Response) => {
  try {
    // Récupérer la configuration existante ou créer une configuration par défaut
    let config = await prisma.siteConfig.findUnique({
      where: { id: CONFIG_ID }
    });

    // Si aucune configuration n'existe, créer une configuration par défaut
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {
          id: CONFIG_ID,
          singlePropertyMode: false,
          mainPropertyId: null
        }
      });
    }

    res.status(200).json(config);
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la configuration' });
  }
};

// Mettre à jour la configuration du site
export const updateSiteConfig = async (req: Request, res: Response) => {
  try {
    const { singlePropertyMode, mainPropertyId } = req.body;

    // Valider les données
    if (typeof singlePropertyMode !== 'boolean') {
      return res.status(400).json({ message: 'Le mode de propriété est requis (true/false)' });
    }

    // Si le mode mono-propriété est activé, vérifier que l'ID de la propriété principale est fourni
    if (singlePropertyMode && !mainPropertyId) {
      return res.status(400).json({ message: 'L\'ID de la propriété principale est requis en mode mono-propriété' });
    }

    // Si un ID de propriété principale est fourni, vérifier qu'il existe
    if (mainPropertyId) {
      const property = await prisma.property.findUnique({
        where: { id: mainPropertyId }
      });

      if (!property) {
        return res.status(404).json({ message: 'La propriété principale spécifiée n\'existe pas' });
      }
    }

    // Mettre à jour ou créer la configuration
    const config = await prisma.siteConfig.upsert({
      where: { id: CONFIG_ID },
      update: {
        singlePropertyMode,
        mainPropertyId: singlePropertyMode ? mainPropertyId : null
      },
      create: {
        id: CONFIG_ID,
        singlePropertyMode,
        mainPropertyId: singlePropertyMode ? mainPropertyId : null
      }
    });

    res.status(200).json(config);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la configuration:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la configuration' });
  }
};
