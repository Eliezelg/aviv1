import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires' });
      return;
    }

    const user = await authService.registerUser({
      email,
      password,
      firstName,
      lastName,
      phoneNumber
    });

    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe' });
      return;
    }

    const user = await authService.loginUser(email, password);
    res.json(user);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Non autorisé' });
      return;
    }

    const user = await authService.getUserProfile(req.user.id);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
