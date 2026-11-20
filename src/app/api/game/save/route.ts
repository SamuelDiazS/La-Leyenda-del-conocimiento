import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { gameRepository } from '@/lib/db/repository';

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { characterId, health, resource, posX, posY, gold, attributes, inventory, equipment } = body;

    const char = await gameRepository.getCharacterById(characterId);
    if (!char) {
      return NextResponse.json({ error: 'Personaje no encontrado' }, { status: 404 });
    }

    if (char.userId !== session.userId && !session.isAdmin) {
      return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
    }

    const updated = await gameRepository.updateCharacter(characterId, {
      ...(health !== undefined && { health: Math.max(0, Math.min(char.maxHealth, health)) }),
      ...(resource !== undefined && { resource: Math.max(0, Math.min(char.maxResource, resource)) }),
      ...(posX !== undefined && { posX }),
      ...(posY !== undefined && { posY }),
      ...(gold !== undefined && { gold }),
      ...(attributes !== undefined && { attributes }),
      ...(inventory !== undefined && { inventory }),
      ...(equipment !== undefined && { equipment }),
    });

    return NextResponse.json({ success: true, character: updated });
  } catch (err: any) {
    console.error('Save error:', err);
    return NextResponse.json({ error: 'Error al guardar estado' }, { status: 500 });
  }
}
