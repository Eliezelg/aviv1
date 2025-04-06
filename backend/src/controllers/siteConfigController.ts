import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const CONFIG_ID = 'default';

// Récupérer la configuration du site
export const getSiteConfig = async (req: Request, res: Response) => {
  try {
    // Compter le nombre de propriétés actives
    const activeProperties = await prisma.property.findMany({
      where: { isAvailable: true }
    });
    
    // Déterminer automatiquement le mode de fonctionnement
    const singlePropertyMode = activeProperties.length === 1;
    const mainPropertyId = singlePropertyMode ? activeProperties[0]?.id : null;
    
    // Récupérer ou créer la configuration
    let config = await prisma.siteConfig.findUnique({
      where: { id: CONFIG_ID }
    });

    // Si aucune configuration n'existe, créer une configuration par défaut
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {
          id: CONFIG_ID,
          singlePropertyMode,
          mainPropertyId
        }
      });
    } else {
      // Mettre à jour la configuration existante
      config = await prisma.siteConfig.update({
        where: { id: CONFIG_ID },
        data: {
          singlePropertyMode,
          mainPropertyId
        }
      });
    }

    res.status(200).json(config);
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la configuration' });
  }
};
