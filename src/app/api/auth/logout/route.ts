import { NextResponse } from 'next/server';
import { getSessionCookieOptions } from '@/lib/auth/jwt';

export async function POST() {
  const res = NextResponse.json({ success: true, message: 'Sesión cerrada' });
  const cookieOpts = getSessionCookieOptions();
  res.cookies.set(cookieOpts.name, '', { ...cookieOpts, maxAge: 0 });
  return res;
}
