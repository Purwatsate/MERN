import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import * as usersRepo from '../repositories/users.repository';
import type { UserRole } from '../types/models';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return secret;
}

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    res.status(400).json({ success: false, message: 'username and password are required' });
    return;
  }

  const user = await usersRepo.findByUsername(username);
  if (!user?.password_hash) {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
    return;
  }

  const signOptions: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '8h') as SignOptions['expiresIn'],
  };
  const token = jwt.sign(
    { userId: user.user_id, username: user.username, role: user.role },
    getJwtSecret(),
    signOptions
  );

  res.json({
    success: true,
    data: {
      token,
      user: {
        user_id: user.user_id,
        badge_number: user.badge_number,
        username: user.username,
        rank: user.rank,
        role: user.role,
      },
    },
  });
}

export async function register(req: Request, res: Response): Promise<void> {
  const { badge_number, username, password, rank, role } = req.body as {
    badge_number?: string;
    username?: string;
    password?: string;
    rank?: string;
    role?: UserRole;
  };

  if (!badge_number || !username || !password) {
    res.status(400).json({
      success: false,
      message: 'badge_number, username, and password are required',
    });
    return;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const userId = await usersRepo.create({
    badge_number,
    username,
    password_hash,
    rank,
    role: role ?? 'Officer',
  });

  const user = await usersRepo.findById(userId);
  res.status(201).json({ success: true, data: user });
}

export async function me(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }
  const user = await usersRepo.findById(req.user.userId);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.json({ success: true, data: user });
}
