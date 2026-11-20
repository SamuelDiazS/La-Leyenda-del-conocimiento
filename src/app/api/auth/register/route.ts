import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { gameRepository } from '@/lib/db/repository';
import { hashPassword } from '@/lib/auth/passwords';
import { signToken, getSessionCookieOptions } from '@/lib/auth/jwt';

const RegisterSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, 'El usuario solo debe contener letras, números y guiones bajos'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { username, email, password } = parsed.data;

    const existingUser = await gameRepository.getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json({ error: 'El nombre de usuario ya está en uso' }, { status: 409 });
    }

    const existingEmail = await gameRepository.getUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json({ error: 'El correo electrónico ya está registrado' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await gameRepository.createUser({
      username,
      email,
      passwordHash,
      isAdmin: false,
      mustChangePassword: false,
    });

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
      },
    });

    const cookieOpts = getSessionCookieOptions();
    res.cookies.set(cookieOpts.name, token, cookieOpts);

    return res;
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Error interno en el registro' }, { status: 500 });
  }
}
