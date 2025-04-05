import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const registerUser = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}) => {
  const { email, password, firstName, lastName, phoneNumber } = userData;

  // Check if user exists
  const userExists = await prisma.user.findUnique({
    where: { email }
  });

  if (userExists) {
    throw new Error('Utilisateur déjà existant');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber
    }
  });

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    token: generateToken(user.id, user.role)
  };
};

/**
 * Authentifie un utilisateur
 */
export const loginUser = async (email: string, password: string) => {
  // Check for user email
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // Vérifier si l'utilisateur a un mot de passe (les utilisateurs invités n'en ont pas)
  if (!user.password) {
    throw new Error('Ce compte a été créé pour une réservation invité et ne peut pas se connecter');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Email ou mot de passe incorrect');
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    token: generateToken(user.id, user.role)
  };
};

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      role: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  return user;
};

// Generate JWT
const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};
