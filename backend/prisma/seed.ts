import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Créer un utilisateur administrateur
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@villaaviv.com' },
    update: {},
    create: {
      email: 'admin@villaaviv.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '+33612345678',
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin);

  // Créer des propriétés de test
  const properties = [
    {
      id: 'villa-mediterranee',
      name: 'Villa Méditerranée',
      description: 'Magnifique villa avec vue sur la mer, piscine privée et accès direct à la plage. Parfaite pour des vacances en famille ou entre amis.',
      capacity: 8,
      pricePerNight: 350,
      images: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
        'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'
      ],
      amenities: ['Piscine', 'Wifi', 'Climatisation', 'Cuisine équipée', 'Terrasse', 'Barbecue', 'Parking'],
      isAvailable: true,
    },
    {
      id: 'chalet-alpin',
      name: 'Chalet Alpin',
      description: 'Chalet traditionnel au cœur des montagnes, idéal pour les amateurs de ski et de randonnée. Ambiance chaleureuse et authentique.',
      capacity: 6,
      pricePerNight: 280,
      images: [
        'https://images.unsplash.com/photo-1542718610-a1d656d1884c',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb'
      ],
      amenities: ['Cheminée', 'Wifi', 'Sauna', 'Cuisine équipée', 'Terrasse', 'Parking'],
      isAvailable: true,
    },
    {
      id: 'appartement-parisien',
      name: 'Appartement Parisien',
      description: 'Élégant appartement au cœur de Paris, à proximité des principaux sites touristiques. Décoré avec goût et entièrement équipé.',
      capacity: 4,
      pricePerNight: 220,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'
      ],
      amenities: ['Wifi', 'Climatisation', 'Cuisine équipée', 'Ascenseur', 'Métro à proximité'],
      isAvailable: true,
    }
  ];

  // Supprimer toutes les propriétés existantes
  await prisma.property.deleteMany({});

  // Créer les nouvelles propriétés
  for (const property of properties) {
    const createdProperty = await prisma.property.create({
      data: property,
    });
    console.log('Property created:', createdProperty.name);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
