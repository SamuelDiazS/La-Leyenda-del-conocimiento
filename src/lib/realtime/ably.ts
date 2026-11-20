import * as Ably from 'ably';

const ABLY_KEY = process.env.ABLY_API_KEY || process.env.NEXT_PUBLIC_ABLY_KEY;

export function getAblyRest() {
  if (!ABLY_KEY) return null;
  try {
    return new Ably.Rest({ key: ABLY_KEY });
  } catch (err) {
    console.error('Failed to initialize Ably Rest client:', err);
    return null;
  }
}

export async function createAblyTokenRequest(clientId: string) {
  const rest = getAblyRest();
  if (!rest) {
    return {
      fallback: true,
      clientId,
      token: `mock_ably_token_${clientId}_${Date.now()}`,
    };
  }
  return rest.auth.createTokenRequest({ clientId });
}
