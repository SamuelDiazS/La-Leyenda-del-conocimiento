import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { gameRepository } from '@/lib/db/repository';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const char = await gameRepository.getCharacterById(params.id);
  if (!char) {
    return NextResponse.json({ error: 'Personaje no encontrado' }, { status: 404 });
  }

  // Ensure owner or admin
  if (char.userId !== session.userId && !session.isAdmin) {
    return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
  }

  const metrics = await gameRepository.getCharacterLearningMetrics(params.id);

  return NextResponse.json({
    success: true,
    character: char,
    learningMetrics: metrics,
  });
}
