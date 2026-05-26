import type { APIRoute } from 'astro';
import { createVideo, listPublishedVideos, listAllVideos } from '../../lib/db';
import {
  ALLOWED_MIMES, MAX_VIDEO_SIZE,
  generateFilename, saveVideoBuffer
} from '../../lib/videos';
import { agents as ALL_AGENTS } from '../../data/agents';

const VALID_SLUGS = new Set(ALL_AGENTS.map(a => a.slug));

function requireAdmin(request: Request): { ok: true } | { ok: false; response: Response } {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ ok: false, error: 'ADMIN_API_KEY ikke satt' }), {
        status: 503, headers: { 'Content-Type': 'application/json' }
      })
    };
  }
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (token !== adminKey) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401, headers: { 'Content-Type': 'application/json' }
      })
    };
  }
  return { ok: true };
}

/**
 * GET /api/videos
 * Public — list published videos.
 * If ?all=1 + admin auth, list all videos.
 */
export const GET: APIRoute = async ({ request, url }) => {
  const wantAll = url.searchParams.get('all') === '1';
  let rows;
  if (wantAll) {
    const admin = requireAdmin(request);
    if (!admin.ok) return admin.response;
    rows = listAllVideos();
  } else {
    rows = listPublishedVideos();
  }
  const videos = rows.map(r => ({
    id: r.id,
    uploaded_at: r.uploaded_at,
    title: r.title,
    description: r.description,
    agent_tags: JSON.parse(r.agent_tags) as string[],
    mime_type: r.mime_type,
    size_bytes: r.size_bytes,
    published: !!r.published,
    file_url: `/api/videos/${r.id}/file`
  }));
  return new Response(JSON.stringify({ ok: true, videos }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
};

/**
 * POST /api/videos  (multipart/form-data)
 * Admin — upload a new video.
 *
 * Form fields:
 *   title       (text, required)
 *   description (text)
 *   agent_tags  (text — JSON array of slugs, OR repeated "agent_tags" fields)
 *   file        (file, required — video/*)
 */
export const POST: APIRoute = async ({ request }) => {
  const admin = requireAdmin(request);
  if (!admin.ok) return admin.response;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Forventet multipart/form-data' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const title = String(form.get('title') || '').trim();
  const description = String(form.get('description') || '').trim();
  const file = form.get('file');

  // Agent tags can come as JSON string or multiple "agent_tags" entries
  let agentTags: string[] = [];
  const tagsRaw = form.get('agent_tags');
  if (typeof tagsRaw === 'string' && tagsRaw.trim().startsWith('[')) {
    try { agentTags = JSON.parse(tagsRaw); } catch {}
  } else {
    agentTags = form.getAll('agent_tags').filter((v): v is string => typeof v === 'string');
  }
  agentTags = agentTags.filter(s => VALID_SLUGS.has(s));

  if (!title || title.length < 2) {
    return new Response(JSON.stringify({ ok: false, error: 'Tittel er påkrevd' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }
  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ ok: false, error: 'Video-fil er påkrevd (felt: file)' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }
  if (file.size === 0) {
    return new Response(JSON.stringify({ ok: false, error: 'Fil er tom' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }
  if (file.size > MAX_VIDEO_SIZE) {
    return new Response(JSON.stringify({
      ok: false,
      error: `Fil for stor. Maks ${Math.floor(MAX_VIDEO_SIZE / (1024 * 1024))} MB.`
    }), { status: 413, headers: { 'Content-Type': 'application/json' } });
  }
  if (!ALLOWED_MIMES.has(file.type)) {
    return new Response(JSON.stringify({
      ok: false,
      error: `Filtype "${file.type || 'ukjent'}" støttes ikke. Tillatt: mp4, webm, mov, mkv, ogv.`
    }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const filename = generateFilename(file.name, file.type);
    const buffer = new Uint8Array(await file.arrayBuffer());
    await saveVideoBuffer(filename, buffer);
    const id = createVideo({
      title,
      description: description || null,
      agent_tags: agentTags,
      filename,
      original_name: file.name,
      mime_type: file.type,
      size_bytes: file.size
    });
    return new Response(JSON.stringify({
      ok: true, id, filename, file_url: `/api/videos/${id}/file`
    }), {
      status: 201, headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: 'Kunne ikke lagre fil: ' + (err?.message || 'ukjent feil') }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
};
