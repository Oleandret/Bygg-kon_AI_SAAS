import type { APIRoute } from 'astro';
import { createOrder, listOrders, countOrders } from '../../lib/db';
import { ORDERABLE_SLUGS } from '../../data/agents';

// Bare orderable agents kan bestilles via skjema
const VALID_SLUGS = new Set<string>(ORDERABLE_SLUGS);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(req: Request): string | null {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    null
  );
}

/**
 * POST /api/orders
 * Public — submit a new order. Returns { ok: true, id }.
 */
export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const name    = typeof body.name === 'string'    ? body.name.trim()    : '';
  const company = typeof body.company === 'string' ? body.company.trim() : '';
  const email   = typeof body.email === 'string'   ? body.email.trim()   : '';
  const phone   = typeof body.phone === 'string'   ? body.phone.trim()   : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const agents  = Array.isArray(body.agents) ? body.agents.filter((s: any) => typeof s === 'string') : [];

  // Validation
  if (!name || name.length < 2) {
    return new Response(JSON.stringify({ ok: false, error: 'Navn er påkrevd' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  if (!EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'Gyldig e-post er påkrevd' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  if (agents.length === 0) {
    return new Response(JSON.stringify({ ok: false, error: 'Velg minst én agent' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  const invalidAgents = agents.filter((s: string) => !VALID_SLUGS.has(s));
  if (invalidAgents.length > 0) {
    return new Response(JSON.stringify({ ok: false, error: `Agenter som ikke er tilgjengelige for bestilling: ${invalidAgents.join(', ')}` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // Honeypot field — bots that fill this get silently dropped
  if (typeof body.website === 'string' && body.website.length > 0) {
    return new Response(JSON.stringify({ ok: true, id: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const id = createOrder({
      name, company: company || null, email,
      phone: phone || null, message: message || null,
      agents,
      ip: getClientIp(request),
      user_agent: request.headers.get('user-agent')
    });
    return new Response(JSON.stringify({ ok: true, id }), {
      status: 201, headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: 'Kunne ikke lagre' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * GET /api/orders?limit=100&offset=0
 * Admin — list all orders. Requires Authorization: Bearer <ADMIN_API_KEY>.
 */
export const GET: APIRoute = async ({ request, url }) => {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    return new Response(JSON.stringify({ ok: false, error: 'ADMIN_API_KEY ikke satt' }), {
      status: 503, headers: { 'Content-Type': 'application/json' }
    });
  }
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (token !== adminKey) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }

  const limit  = Math.min(parseInt(url.searchParams.get('limit')  || '100', 10), 500);
  const offset = Math.max(parseInt(url.searchParams.get('offset') || '0',  10), 0);

  const rows  = listOrders(limit, offset);
  const total = countOrders();
  // Parse agents JSON for nicer output
  const orders = rows.map(r => ({ ...r, agents: JSON.parse(r.agents) }));

  return new Response(JSON.stringify({ ok: true, total, limit, offset, orders }, null, 2), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
};
