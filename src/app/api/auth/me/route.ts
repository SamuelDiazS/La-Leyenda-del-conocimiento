import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { gameRepository } from '@/lib/db/repository';

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const user = await gameRepository.getUserById(session.userId);
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      mustChangePassword: user.mustChangePassword,
    },
  });
}
