import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { gameRepository } from '@/lib/db/repository';
import { verifyPassword } from '@/lib/auth/passwords';
import { signToken, getSessionCookieOptions } from '@/lib/auth/jwt';

const LoginSchema = z.object({
  username: z.string().min(1, 'Ingresa tu usuario'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { username, password } = parsed.data;

    // Check if user exists
    const user = await gameRepository.getUserByUsername(username);
    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Verify bcrypt password
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      mustChangePassword: user.mustChangePassword,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        mustChangePassword: user.mustChangePassword,
      },
    });

    const cookieOpts = getSessionCookieOptions();
    res.cookies.set(cookieOpts.name, token, cookieOpts);

    return res;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Error en la autenticación' }, { status: 500 });
  }
}
