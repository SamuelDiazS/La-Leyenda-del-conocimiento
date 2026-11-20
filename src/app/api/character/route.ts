import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/jwt';
import { gameRepository } from '@/lib/db/repository';

const CreateCharSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(20),
  race: z.enum(['human', 'elf', 'dwarf', 'dragonkin', 'sylvan']),
  class: z.enum(['guardian', 'arcanist', 'ranger', 'summoner', 'runic_engineer', 'scholar']),
  appearance: z.object({
    gender: z.enum(['male', 'female', 'unisex']),
    skinTone: z.string(),
    hairStyle: z.string(),
    hairColor: z.string(),
    eyeColor: z.string(),
    outfitColor: z.string(),
    capeColor: z.string(),
  }),
});

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const characters = await gameRepository.getCharactersByUserId(session.userId);
  return NextResponse.json({ success: true, characters });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = CreateCharSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { name, race, class: charClass, appearance } = parsed.data;

    const newChar = await gameRepository.createCharacter({
      userId: session.userId,
      name,
      race,
      class: charClass,
      appearance,
    });

    return NextResponse.json({ success: true, character: newChar });
  } catch (err: any) {
    console.error('Character creation error:', err);
    return NextResponse.json({ error: 'Error al forjar el personaje' }, { status: 500 });
  }
}
