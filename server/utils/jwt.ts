import jwt from 'jsonwebtoken';
import { UserRole } from '../../src/types/database.js';

const JWT_SECRET = process.env.AUTH_SECRET || 'digital-install-super-secure-jwt-secret-key-2026';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}
