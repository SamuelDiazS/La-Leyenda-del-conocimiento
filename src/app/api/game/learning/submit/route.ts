import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/jwt';
import { gameRepository } from '@/lib/db/repository';
import { EDUCATIONAL_ACTIVITIES } from '@/lib/game/constants';

const SubmitSchema = z.object({
  characterId: z.string(),
  activityId: z.number(),
  optionId: z.number(),
  timeSpentSeconds: z.number().min(0),
});

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = SubmitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { characterId, activityId, optionId, timeSpentSeconds } = parsed.data;

    const char = await gameRepository.getCharacterById(characterId);
    if (!char) {
      return NextResponse.json({ error: 'Personaje no encontrado' }, { status: 404 });
    }

    if (char.userId !== session.userId && !session.isAdmin) {
      return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
    }

    const activity = EDUCATIONAL_ACTIVITIES.find((a) => a.id === activityId);
    if (!activity) {
      return NextResponse.json({ error: 'Actividad educativa no encontrada' }, { status: 404 });
    }

    const selectedOption = activity.options.find((o) => o.id === optionId);
    if (!selectedOption) {
      return NextResponse.json({ error: 'Opción no válida' }, { status: 400 });
    }

    const isCorrect = selectedOption.isCorrect;

    // Record attempt for ICFES Saber 11 tracking
    await gameRepository.recordLearningAttempt(
      characterId,
      activityId,
      optionId,
      isCorrect,
      timeSpentSeconds
    );

    let expGained = 0;
    let goldGained = 0;
    let leveledUp = false;

    if (isCorrect) {
      expGained = activity.rewardExp;
      goldGained = activity.rewardGold;

      let newExp = char.experience + expGained;
      let newLevel = char.level;
      let expToNext = char.experienceToNext;
      let attrPoints = char.attributePoints;
      let skillPoints = char.skillPoints;

      // Handle level up
      while (newExp >= expToNext) {
        newExp -= expToNext;
        newLevel += 1;
        expToNext = Math.round(expToNext * 1.5);
        attrPoints += 3;
        skillPoints += 1;
        leveledUp = true;
      }

      await gameRepository.updateCharacter(characterId, {
        experience: newExp,
        level: newLevel,
        experienceToNext: expToNext,
        attributePoints: attrPoints,
        skillPoints: skillPoints,
        gold: char.gold + goldGained,
      });
    }

    const updatedChar = await gameRepository.getCharacterById(characterId);
    const updatedMetrics = await gameRepository.getCharacterLearningMetrics(characterId);

    return NextResponse.json({
      success: true,
      isCorrect,
      pedagogicalExplanation: selectedOption.pedagogicalExplanation,
      expGained,
      goldGained,
      leveledUp,
      character: updatedChar,
      learningMetrics: updatedMetrics,
    });
  } catch (err: any) {
    console.error('Learning submission error:', err);
    return NextResponse.json({ error: 'Error procesando la actividad' }, { status: 500 });
  }
}
