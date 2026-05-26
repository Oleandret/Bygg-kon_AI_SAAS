import { mkdirSync, createReadStream, statSync, existsSync } from 'node:fs';
import { writeFile, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';

// Videos directory — on Railway mount a volume at /app/data and set DB_PATH there
// Videos go in same volume under /videos
const VIDEOS_DIR = process.env.VIDEOS_DIR
  || (process.env.DB_PATH ? join(process.env.DB_PATH, '..', 'videos') : './data/videos');

try { mkdirSync(VIDEOS_DIR, { recursive: true }); } catch {}

// Limit: 200 MB
export const MAX_VIDEO_SIZE = 200 * 1024 * 1024;

export const ALLOWED_MIMES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',  // .mov
  'video/x-matroska', // .mkv
  'video/ogg'
]);

export function videosDir(): string {
  return VIDEOS_DIR;
}

export function videoPath(filename: string): string {
  return join(VIDEOS_DIR, filename);
}

export function videoExists(filename: string): boolean {
  return existsSync(videoPath(filename));
}

/** Generate a safe, unique filename based on UUID + original extension */
export function generateFilename(originalName: string, mimeType: string): string {
  let ext = extname(originalName).toLowerCase();
  if (!ext) {
    // Fall back to mime → extension
    const map: Record<string, string> = {
      'video/mp4': '.mp4',
      'video/webm': '.webm',
      'video/quicktime': '.mov',
      'video/x-matroska': '.mkv',
      'video/ogg': '.ogv'
    };
    ext = map[mimeType] ?? '.mp4';
  }
  return `${randomUUID()}${ext}`;
}

/** Save a Buffer/Uint8Array to disk under the videos directory */
export async function saveVideoBuffer(filename: string, data: Uint8Array): Promise<void> {
  await writeFile(videoPath(filename), data);
}

/** Delete a video file from disk (silent if missing) */
export async function deleteVideoFile(filename: string): Promise<void> {
  try {
    await unlink(videoPath(filename));
  } catch {
    // ignore — file may already be gone
  }
}

/** Build a Web Response for streaming a video file, with HTTP Range support */
export function buildVideoResponse(
  filename: string,
  mimeType: string,
  rangeHeader: string | null
): Response {
  const path = videoPath(filename);
  if (!existsSync(path)) {
    return new Response('Not found', { status: 404 });
  }
  const stats = statSync(path);
  const total = stats.size;

  if (rangeHeader) {
    const match = /^bytes=(\d+)-(\d*)$/.exec(rangeHeader.trim());
    if (match) {
      const start = parseInt(match[1], 10);
      const end   = match[2] ? parseInt(match[2], 10) : Math.min(start + 1024 * 1024 * 2 - 1, total - 1);
      if (start >= total || end >= total || start > end) {
        return new Response('Range Not Satisfiable', {
          status: 416,
          headers: { 'Content-Range': `bytes */${total}` }
        });
      }
      const chunkSize = end - start + 1;
      const nodeStream = createReadStream(path, { start, end });
      const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;
      return new Response(webStream, {
        status: 206,
        headers: {
          'Content-Type': mimeType,
          'Content-Length': String(chunkSize),
          'Content-Range': `bytes ${start}-${end}/${total}`,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
  }

  // Full file
  const nodeStream = createReadStream(path);
  const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;
  return new Response(webStream, {
    status: 200,
    headers: {
      'Content-Type': mimeType,
      'Content-Length': String(total),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
