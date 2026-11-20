import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { createAblyTokenRequest } from '@/lib/realtime/ably';

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  const clientId = session ? session.username : `guest_${Math.random().toString(36).substring(2, 7)}`;

  try {
    const tokenRequest = await createAblyTokenRequest(clientId);
    return NextResponse.json(tokenRequest);
  } catch (err: any) {
    console.error('Ably auth error:', err);
    return NextResponse.json({ error: 'Error generando token de tiempo real' }, { status: 500 });
  }
}
