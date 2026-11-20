import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { gameRepository } from '@/lib/db/repository';

export async function GET() {
  const session = await getCurrentUser();
  if (!session || !session.isAdmin) {
    return NextResponse.json({ error: 'Acceso denegado: Se requiere rol de Administrador' }, { status: 403 });
  }

  const stats = await gameRepository.getGlobalStats();
  const auditLogs = await gameRepository.getAuditLogs();

  return NextResponse.json({
    success: true,
    stats,
    auditLogs: auditLogs.slice(0, 50),
  });
}
