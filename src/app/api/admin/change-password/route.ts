import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser, signToken, getSessionCookieOptions } from '@/lib/auth/jwt';
import { gameRepository } from '@/lib/db/repository';
import { hashPassword } from '@/lib/auth/passwords';

const ChangePasswordSchema = z.object({
  newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
});

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = ChangePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { newPassword } = parsed.data;
    const newHash = await hashPassword(newPassword);

    await gameRepository.updateUserPassword(session.userId, newHash);
    gameRepository.logAudit(session.username, 'PASSWORD_CHANGE', { userId: session.userId });

    // Refresh token with mustChangePassword = false
    const updatedToken = signToken({
      ...session,
      mustChangePassword: false,
    });

    const res = NextResponse.json({ success: true, message: 'Contraseña actualizada con éxito' });
    const cookieOpts = getSessionCookieOptions();
    res.cookies.set(cookieOpts.name, updatedToken, cookieOpts);

    return res;
  } catch (err: any) {
    console.error('Password change error:', err);
    return NextResponse.json({ error: 'Error al cambiar contraseña' }, { status: 500 });
  }
}
