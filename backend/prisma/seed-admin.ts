import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Vérifier si l'utilisateur admin existe déjà
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@villaaviv.com' }
    });

    if (adminExists) {
      console.log('L\'administrateur existe déjà.');
      return;
    }

    // Créer un mot de passe hashé
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Créer l'utilisateur administrateur
    const admin = await prisma.user.create({
      data: {
        email: 'admin@villaaviv.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Villa Aviv',
        role: 'ADMIN'
      }
    });

    console.log('Administrateur créé avec succès:', admin);
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
