import type { APIRoute } from 'astro';
import { getVideo, deleteVideo } from '../../../lib/db';
import { deleteVideoFile } from '../../../lib/videos';

/**
 * DELETE /api/videos/[id]
 * Admin — delete video metadata + file.
 */
export const DELETE: APIRoute = async ({ request, params }) => {
  const adminKey = (process.env.ADMIN_API_KEY || '').trim();
  if (!adminKey) {
    return new Response(JSON.stringify({ ok: false, error: 'ADMIN_API_KEY ikke satt på serveren' }), {
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

  const id = parseInt(params.id || '', 10);
  if (!Number.isFinite(id) || id <= 0) {
    return new Response(JSON.stringify({ ok: false, error: 'Ugyldig ID' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const video = getVideo(id);
  if (!video) {
    return new Response(JSON.stringify({ ok: false, error: 'Ikke funnet' }), {
      status: 404, headers: { 'Content-Type': 'application/json' }
    });
  }

  await deleteVideoFile(video.filename);
  deleteVideo(id);

  return new Response(JSON.stringify({ ok: true, deleted: id }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
};
