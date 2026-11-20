import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/jwt';
import { gameRepository } from '@/lib/db/repository';

const CombatRewardSchema = z.object({
  characterId: z.string(),
  enemyCode: z.string(),
  enemyLevel: z.number().min(1),
});

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = CombatRewardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { characterId, enemyCode, enemyLevel } = parsed.data;

    const char = await gameRepository.getCharacterById(characterId);
    if (!char) {
      return NextResponse.json({ error: 'Personaje no encontrado' }, { status: 404 });
    }

    if (char.userId !== session.userId && !session.isAdmin) {
      return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
    }

    // Calculate server-side rewards
    const expGained = Math.round(30 * enemyLevel);
    const goldGained = Math.floor(Math.random() * (4 * enemyLevel)) + 2;

    let newExp = char.experience + expGained;
    let newLevel = char.level;
    let expToNext = char.experienceToNext;
    let attrPoints = char.attributePoints;
    let skillPoints = char.skillPoints;
    let leveledUp = false;

    while (newExp >= expToNext) {
      newExp -= expToNext;
      newLevel += 1;
      expToNext = Math.round(expToNext * 1.5);
      attrPoints += 3;
      skillPoints += 1;
      leveledUp = true;
    }

    const updated = await gameRepository.updateCharacter(characterId, {
      experience: newExp,
      level: newLevel,
      experienceToNext: expToNext,
      attributePoints: attrPoints,
      skillPoints: skillPoints,
      gold: char.gold + goldGained,
    });

    return NextResponse.json({
      success: true,
      expGained,
      goldGained,
      leveledUp,
      character: updated,
    });
  } catch (err: any) {
    console.error('Combat action error:', err);
    return NextResponse.json({ error: 'Error al procesar recompensa' }, { status: 500 });
  }
}
