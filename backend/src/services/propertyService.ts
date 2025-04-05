import { PrismaClient, Property } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProperties = async () => {
  return await prisma.property.findMany();
};

export const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id }
  });

  if (!property) {
    throw new Error('Propriété non trouvée');
  }

  return property;
};

export const createProperty = async (propertyData: {
  name: string;
  description: string;
  capacity: number;
  pricePerNight: number;
  images: string[];
  amenities: string[];
}) => {
  return await prisma.property.create({
    data: propertyData
  });
};

export const updateProperty = async (
  id: string,
  propertyData: Partial<{
    name: string;
    description: string;
    capacity: number;
    pricePerNight: number;
    images: string[];
    amenities: string[];
    isAvailable: boolean;
  }>
) => {
  const property = await prisma.property.findUnique({
    where: { id }
  });

  if (!property) {
    throw new Error('Propriété non trouvée');
  }

  return await prisma.property.update({
    where: { id },
    data: propertyData
  });
};

export const deleteProperty = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id }
  });

  if (!property) {
    throw new Error('Propriété non trouvée');
  }

  return await prisma.property.delete({
    where: { id }
  });
};

export const checkPropertyAvailability = async (
  propertyId: string,
  startDate: Date,
  endDate: Date
) => {
  // Check if property exists
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  });

  if (!property) {
    throw new Error('Propriété non trouvée');
  }

  if (!property.isAvailable) {
    return false;
  }

  // Check for overlapping reservations
  const overlappingReservations = await prisma.reservation.findMany({
    where: {
      propertyId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      OR: [
        {
          // New reservation starts during an existing reservation
          AND: [
            { startDate: { lte: endDate } },
            { endDate: { gte: startDate } }
          ]
        }
      ]
    }
  });

  return overlappingReservations.length === 0;
};

/**
 * Récupère toutes les dates indisponibles pour une propriété
 * Retourne un tableau de plages de dates (startDate, endDate)
 */
export const getUnavailableDates = async (propertyId: string) => {
  // Vérifier si la propriété existe
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  });

  if (!property) {
    throw new Error('Propriété non trouvée');
  }

  if (!property.isAvailable) {
    // Si la propriété est marquée comme indisponible, retourner une plage de dates très large
    return [{
      startDate: new Date(2000, 0, 1), // 1er janvier 2000
      endDate: new Date(2100, 11, 31)  // 31 décembre 2100
    }];
  }

  // Récupérer toutes les réservations confirmées ou en attente pour cette propriété
  const reservations = await prisma.reservation.findMany({
    where: {
      propertyId,
      status: { in: ['PENDING', 'CONFIRMED'] }
    },
    select: {
      startDate: true,
      endDate: true
    }
  });

  // Retourner les plages de dates des réservations
  return reservations.map(reservation => ({
    startDate: reservation.startDate,
    endDate: reservation.endDate
  }));
};
