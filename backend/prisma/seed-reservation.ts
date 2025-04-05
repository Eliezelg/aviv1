import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Vérifier si la propriété existe
  const property = await prisma.property.findFirst();
  
  if (!property) {
    console.error("Aucune propriété trouvée. Veuillez d'abord exécuter le script seed.ts");
    process.exit(1);
  }

  // Créer une réservation de test avec l'ID spécifique
  const reservationId = 'c5100cd1-0e16-4af6-98b6-3311a9c54e24';
  
  // Supprimer la réservation si elle existe déjà
  await prisma.reservation.deleteMany({
    where: { id: reservationId }
  });
  
  // Créer la réservation
  const reservation = await prisma.reservation.create({
    data: {
      id: reservationId,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Dans une semaine
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Dans deux semaines
      numberOfGuests: 2,
      specialRequests: "Nous aimerions une bouteille de champagne à l'arrivée.",
      totalPrice: 1400, // 7 jours à 200€
      depositAmount: 420, // 30% de l'acompte
      depositPaid: true,
      status: 'CONFIRMED',
      confirmationCode: 'TEST123',
      guestEmail: 'test@example.com',
      stripePaymentId: 'cs_test_a17WmRm77hPtZEZWsDD02gnNvFcgI9BARBVvQJ38stsrswmaWuUxBs9Ynm',
      property: {
        connect: { id: property.id }
      }
    }
  });

  console.log('Réservation de test créée:', reservation);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
