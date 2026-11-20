import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { gameRepository } from '@/lib/db/repository';

export async function GET() {
  const session = await getCurrentUser();
  if (!session || !session.isAdmin) {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }

  const users = await gameRepository.getAllUsers();
  const enrichedUsers = await Promise.all(
    users.map(async (u) => {
      const chars = await gameRepository.getCharactersByUserId(u.id);
      return {
        id: u.id,
        username: u.username,
        email: u.email,
        isAdmin: u.isAdmin,
        mustChangePassword: u.mustChangePassword,
        createdAt: u.createdAt,
        characters: chars,
      };
    })
  );

  return NextResponse.json({ success: true, users: enrichedUsers });
}
