# BYGG-KON.ai — SaaS

Astro 4 + Tailwind. Premium SaaS-design med animerte mesh-gradients, svevende orbs, per-agent pipeline-visualiseringer, og bestillingsskjema med SQLite + API.

## Tech

- Astro 4 · @astrojs/node (standalone, SSR)
- Tailwind CSS 3
- TypeScript
- better-sqlite3 (lagring av bestillinger)
- Inter + Instrument Serif + JetBrains Mono

## Lokalt

```bash
npm install
npm run dev          # http://localhost:4321
npm run build
npm start            # http://localhost:3000
```

## Miljøvariabler

| Variabel | Krav | Beskrivelse |
|---|---|---|
| `PORT` | nei | Port (default 3000) |
| `DB_PATH` | nei | SQLite-sti (default `./data/orders.sqlite`). På Railway: pek til volume, f.eks. `/app/data/orders.sqlite` |
| `ADMIN_API_KEY` | **ja, for GET /api/orders** | Hemmelig nøkkel for å hente ut bestillinger. Lang random streng. |

## Deploy til Railway

```bash
git init
git add .
git commit -m "Initial commit: BYGG-KON.ai SaaS"
git branch -M main
git remote add origin https://github.com/Oleandret/Bygg-kon_AI_SAAS.git
git push -u origin main
```

På [railway.app](https://railway.app):

1. **New Project → Deploy from GitHub repo** → velg `Bygg-kon_AI_SAAS`
2. Railway bygger automatisk (nixpacks)
3. **Service → Volumes → New Volume** → mount path: `/app/data`
4. **Variables**:
   - `DB_PATH` = `/app/data/orders.sqlite`
   - `ADMIN_API_KEY` = generer en lang random streng (f.eks. `openssl rand -hex 32`)
5. **Settings → Generate Domain**

## API

### `POST /api/orders` — offentlig, sender inn bestilling

```bash
curl -X POST https://din-app.up.railway.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ole",
    "company": "Bedrift AS",
    "email": "ole@bedrift.no",
    "phone": "+47 123 45 678",
    "message": "Vi vil ha tilbud på Loki og KI Tilbud",
    "agents": ["loki", "ki-tilbud"]
  }'
```

Returnerer `{ ok: true, id: 42 }`.

### `GET /api/orders` — beskyttet, lister alle bestillinger

```bash
curl https://din-app.up.railway.app/api/orders \
  -H "Authorization: Bearer DIN_ADMIN_API_KEY"
```

Query-params: `?limit=100&offset=0`.

Returnerer:
```json
{
  "ok": true,
  "total": 12,
  "limit": 100,
  "offset": 0,
  "orders": [
    {
      "id": 12,
      "created_at": "2026-05-26 14:23:01",
      "name": "Ole",
      "company": "Bedrift AS",
      "email": "ole@bedrift.no",
      "phone": "+47 ...",
      "message": "Vi vil ha tilbud på Loki og KI Tilbud",
      "agents": ["loki", "ki-tilbud"],
      "handled": 0
    }
  ]
}
```

## Database

SQLite-skjema:

```sql
CREATE TABLE orders (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  name        TEXT    NOT NULL,
  company     TEXT,
  email       TEXT    NOT NULL,
  phone       TEXT,
  message     TEXT,
  agents      TEXT    NOT NULL,    -- JSON-string
  handled     INTEGER NOT NULL DEFAULT 0,
  ip          TEXT,
  user_agent  TEXT
);
```

For å hente bestillinger manuelt på Railway: `railway run sqlite3 /app/data/orders.sqlite "SELECT * FROM orders;"`

## Sider

- `/` — landing (hero, agenter, pipelines, leveranser, stack, CTA)
- `/agent/[slug]` — agent-detalj
- `/bestill` — bestillingsskjema
- `/api/orders` — API-endepunkt (POST/GET)

## Struktur

```
src/
├── data/agents.ts                # Sentral datafil for alle 6 agenter
├── lib/db.ts                     # SQLite-tilkobling
├── layouts/Layout.astro
├── components/
│   ├── Nav.astro                 # Agent quick-tabs + main nav
│   ├── Hero.astro                # Editorial hero + animert arkitektur
│   ├── Trust.astro
│   ├── Agenter.astro             # 6 agent-kort
│   ├── Pipelines.astro           # Per-agent animert pipeline-grid
│   ├── Leveranser.astro          # Case cards med vertikalt flytdiagram
│   ├── Prosess.astro             # Tech-konsepter (Claude, MCP, ...)
│   ├── CTA.astro
│   └── Footer.astro
├── pages/
│   ├── index.astro
│   ├── bestill.astro             # Bestillingsskjema
│   ├── agent/[slug].astro
│   └── api/orders.ts             # POST + GET endepunkter
└── styles/global.css
```

## Lisens

© 2026 BYGG-KON AS.
