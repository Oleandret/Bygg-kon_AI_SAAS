import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

// On Railway, mount a persistent volume to /app/data
// Locally, fallback to ./data/orders.sqlite
const DB_PATH = process.env.DB_PATH || './data/orders.sqlite';

try { mkdirSync(dirname(DB_PATH), { recursive: true }); } catch {}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ============================================================
// SCHEMA
// ============================================================
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    name        TEXT    NOT NULL,
    company     TEXT,
    email       TEXT    NOT NULL,
    phone       TEXT,
    message     TEXT,
    agents      TEXT    NOT NULL,
    handled     INTEGER NOT NULL DEFAULT 0,
    ip          TEXT,
    user_agent  TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_orders_handled    ON orders(handled);

  CREATE TABLE IF NOT EXISTS videos (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    uploaded_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    title         TEXT    NOT NULL,
    description   TEXT,
    agent_tags    TEXT    NOT NULL DEFAULT '[]',  -- JSON array of agent slugs
    filename      TEXT    NOT NULL UNIQUE,        -- on-disk filename
    original_name TEXT    NOT NULL,
    mime_type     TEXT    NOT NULL,
    size_bytes    INTEGER NOT NULL,
    published     INTEGER NOT NULL DEFAULT 1
  );
  CREATE INDEX IF NOT EXISTS idx_videos_uploaded_at ON videos(uploaded_at DESC);
  CREATE INDEX IF NOT EXISTS idx_videos_published   ON videos(published);
`);

// ============================================================
// ORDERS
// ============================================================
export type OrderInput = {
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  message?: string | null;
  agents: string[];
  ip?: string | null;
  user_agent?: string | null;
};

export type OrderRow = {
  id: number; created_at: string; name: string;
  company: string | null; email: string; phone: string | null;
  message: string | null; agents: string; handled: number;
  ip: string | null; user_agent: string | null;
};

const ordersInsert = db.prepare(`
  INSERT INTO orders (name, company, email, phone, message, agents, ip, user_agent)
  VALUES (@name, @company, @email, @phone, @message, @agents, @ip, @user_agent)
`);
const ordersList = db.prepare(`SELECT * FROM orders ORDER BY created_at DESC LIMIT @limit OFFSET @offset`);
const ordersCount = db.prepare(`SELECT COUNT(*) as n FROM orders`);
const ordersMarkHandled = db.prepare(`UPDATE orders SET handled = 1 WHERE id = ?`);

export function createOrder(input: OrderInput): number {
  const info = ordersInsert.run({
    name: input.name, company: input.company ?? null, email: input.email,
    phone: input.phone ?? null, message: input.message ?? null,
    agents: JSON.stringify(input.agents),
    ip: input.ip ?? null, user_agent: input.user_agent ?? null
  });
  return info.lastInsertRowid as number;
}
export function listOrders(limit = 100, offset = 0): OrderRow[] {
  return ordersList.all({ limit, offset }) as OrderRow[];
}
export function countOrders(): number {
  return (ordersCount.get() as { n: number }).n;
}
export function markHandled(id: number): void { ordersMarkHandled.run(id); }

// ============================================================
// VIDEOS
// ============================================================
export type VideoInput = {
  title: string;
  description?: string | null;
  agent_tags: string[];
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
};

export type VideoRow = {
  id: number; uploaded_at: string; title: string;
  description: string | null; agent_tags: string;
  filename: string; original_name: string; mime_type: string;
  size_bytes: number; published: number;
};

const videosInsert = db.prepare(`
  INSERT INTO videos (title, description, agent_tags, filename, original_name, mime_type, size_bytes)
  VALUES (@title, @description, @agent_tags, @filename, @original_name, @mime_type, @size_bytes)
`);
const videosList = db.prepare(`SELECT * FROM videos WHERE published = 1 ORDER BY uploaded_at DESC`);
const videosListAll = db.prepare(`SELECT * FROM videos ORDER BY uploaded_at DESC`);
const videosGetById = db.prepare(`SELECT * FROM videos WHERE id = ?`);
const videosDelete = db.prepare(`DELETE FROM videos WHERE id = ?`);

export function createVideo(input: VideoInput): number {
  const info = videosInsert.run({
    title: input.title,
    description: input.description ?? null,
    agent_tags: JSON.stringify(input.agent_tags),
    filename: input.filename,
    original_name: input.original_name,
    mime_type: input.mime_type,
    size_bytes: input.size_bytes
  });
  return info.lastInsertRowid as number;
}
export function listPublishedVideos(): VideoRow[] {
  return videosList.all() as VideoRow[];
}
export function listAllVideos(): VideoRow[] {
  return videosListAll.all() as VideoRow[];
}
export function getVideo(id: number): VideoRow | undefined {
  return videosGetById.get(id) as VideoRow | undefined;
}
export function deleteVideo(id: number): void {
  videosDelete.run(id);
}

export default db;
