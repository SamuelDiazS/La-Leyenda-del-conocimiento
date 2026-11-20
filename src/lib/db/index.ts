import { gameRepository } from './repository';
import { Pool } from '@neondatabase/serverless';

// Export unified db accessor
export const db = gameRepository;

// Helper to check if Neon connection is configured
export function isNeonConfigured(): boolean {
  return !!process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon.tech');
}

export function getNeonPool(): Pool | null {
  if (!isNeonConfigured()) return null;
  try {
    return new Pool({ connectionString: process.env.DATABASE_URL });
  } catch (err) {
    console.error('Error initializing Neon connection pool:', err);
    return null;
  }
}
