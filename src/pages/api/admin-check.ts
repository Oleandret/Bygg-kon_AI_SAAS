import type { APIRoute } from 'astro';

/**
 * GET /api/admin-check
 *
 * Diagnose-endepunkt. Returnerer om ADMIN_API_KEY er konfigurert på serveren,
 * og om Authorization-headeren (hvis sendt) matcher.
 *
 * Lekker ALDRI selve nøkkelen — bare lengde og første tegn for debugging.
 *
 * Eksempler:
 *   GET /api/admin-check                              → er nøkkel satt på server?
 *   GET /api/admin-check  + Authorization: Bearer xx  → matcher klient-nøkkelen?
 */
export const GET: APIRoute = async ({ request }) => {
  const raw = process.env.ADMIN_API_KEY;
  const adminKey = (raw || '').trim();
  const isSet = adminKey.length > 0;

  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  const tokenProvided = token.length > 0;

  const result: any = {
    ok: isSet,
    server_key_configured: isSet,
    server_key_length: adminKey.length,
    server_key_first_char: adminKey[0] || null,
    server_key_last_char:  adminKey.length > 1 ? adminKey[adminKey.length - 1] : null,
    server_key_had_whitespace: raw !== adminKey,
    token_provided: tokenProvided,
    token_length: token.length,
    matches: isSet && tokenProvided && token === adminKey
  };

  if (!isSet) {
    result.hint = 'ADMIN_API_KEY er IKKE satt på Railway. Gå til Variables-tab, legg den til, og REDEPLOY tjenesten.';
  } else if (!tokenProvided) {
    result.hint = 'Server-nøkkel er satt ✓. Send Authorization: Bearer <din-nøkkel> for å teste match.';
  } else if (!result.matches) {
    result.hint = `Server- og klient-nøkkel matcher ikke. Server: ${adminKey.length} tegn (start: '${adminKey[0]}'), klient: ${token.length} tegn (start: '${token[0]}'). Sjekk om Railway lagret med ekstra mellomrom/anførselstegn.`;
  } else {
    result.hint = 'Alt OK ✓ — server-nøkkel og klient-nøkkel matcher.';
  }

  return new Response(JSON.stringify(result, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
