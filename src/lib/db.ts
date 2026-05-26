import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

// On Railway, mount a persistent volume to /app/data
// Locally, fallback to ./data/orders.sqlite
const DB_PATH = process.env.DB_PATH || './data/orders.sqlite';

// Ensure directory exists
try {
  mkdirSync(dirname(DB_PATH), { recursive: true });
} catch {}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Schema — one table for orders
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    name        TEXT    NOT NULL,
    company     TEXT,
    email       TEXT    NOT NULL,
    phone       TEXT,
    message     TEXT,
    agents      TEXT    NOT NULL,         -- JSON-string of agent-slugs
    handled     INTEGER NOT NULL DEFAULT 0,
    ip          TEXT,
    user_agent  TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_orders_handled    ON orders(handled);
`);

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
  id: number;
  created_at: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  agents: string;  // raw JSON
  handled: number;
  ip: string | null;
  user_agent: string | null;
};

const insertStmt = db.prepare(`
  INSERT INTO orders (name, company, email, phone, message, agents, ip, user_agent)
  VALUES (@name, @company, @email, @phone, @message, @agents, @ip, @user_agent)
`);

const listStmt = db.prepare(`
  SELECT * FROM orders ORDER BY created_at DESC LIMIT @limit OFFSET @offset
`);

const countStmt = db.prepare(`SELECT COUNT(*) as n FROM orders`);

const markHandledStmt = db.prepare(`UPDATE orders SET handled = 1 WHERE id = ?`);

export function createOrder(input: OrderInput): number {
  const info = insertStmt.run({
    name:       input.name,
    company:    input.company ?? null,
    email:      input.email,
    phone:      input.phone ?? null,
    message:    input.message ?? null,
    agents:     JSON.stringify(input.agents),
    ip:         input.ip ?? null,
    user_agent: input.user_agent ?? null
  });
  return info.lastInsertRowid as number;
}

export function listOrders(limit = 100, offset = 0): OrderRow[] {
  return listStmt.all({ limit, offset }) as OrderRow[];
}

export function countOrders(): number {
  const r = countStmt.get() as { n: number };
  return r.n;
}

export function markHandled(id: number): void {
  markHandledStmt.run(id);
}

export default db;
