import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET = process.env.SESSION_SECRET || 'aethoria_secret_session_key_knowledge_legend_2026_production';
const COOKIE_NAME = 'aethoria_session';

export interface SessionPayload {
  userId: string;
  username: string;
  email: string;
  isAdmin: boolean;
  mustChangePassword?: boolean;
}

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function getSessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}
