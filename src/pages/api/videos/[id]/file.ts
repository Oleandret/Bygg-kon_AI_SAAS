import type { APIRoute } from 'astro';
import { getVideo } from '../../../../lib/db';
import { buildVideoResponse } from '../../../../lib/videos';

/**
 * GET /api/videos/[id]/file
 * Public — stream video file. Supports HTTP Range requests for seeking.
 */
export const GET: APIRoute = async ({ params, request }) => {
  const id = parseInt(params.id || '', 10);
  if (!Number.isFinite(id) || id <= 0) {
    return new Response('Bad request', { status: 400 });
  }
  const video = getVideo(id);
  if (!video || !video.published) {
    return new Response('Not found', { status: 404 });
  }
  return buildVideoResponse(video.filename, video.mime_type, request.headers.get('range'));
};
