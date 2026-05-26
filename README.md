# BYGG-KON.ai — SaaS

Premium SaaS-grade nettside for BYGG-KONs AI-plattform. Astro 4 + Tailwind, designet med moderne SaaS-aesthetic (Linear/Vercel-stil).

## Designvalg

- **Typografi**: Inter (sans) + Instrument Serif (italic display) for editorial accent
- **Farger**: Lyst hovedtema med mesh-gradient subtilt i hero, brand-fargene som aksenter
- **Layout**: Generøs whitespace, rounded-3xl kort, soft shadows
- **Hero**: Editorial split-headline med animert MCP-arkitektur og live-indikator
- **Effekter**: Glassmorphism nav, noise overlay, hover-glow på kort

## Tech

- Astro 4 · @astrojs/node (standalone)
- Tailwind CSS 3
- TypeScript
- Inter + Instrument Serif + JetBrains Mono (Google Fonts)

## Lokalt

```bash
npm install
npm run dev          # http://localhost:4321
npm run build
npm start            # http://localhost:3000
```

## Deploy til Railway

```bash
git init
git add .
git commit -m "Initial commit: BYGG-KON.ai SaaS"
git branch -M main
git remote add origin https://github.com/Oleandret/Bygg-kon_AI_SAAS.git
git push -u origin main
```

Deretter på [railway.app](https://railway.app): **New Project → Deploy from GitHub repo** → velg `Bygg-kon_AI_SAAS` → **Generate Domain**.

## Struktur

```
bygg-kon-ai-saas/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── nixpacks.toml
├── railway.json
└── src/
    ├── data/agents.ts            # Sentral datafil for alle 6 agenter
    ├── layouts/Layout.astro      # HTML + nav + footer
    ├── components/
    │   ├── Nav.astro             # Premium nav med agent-tabs
    │   ├── Hero.astro            # Editorial hero med animert arkitektur
    │   ├── Trust.astro           # "Bygget på"-stripe
    │   ├── Agenter.astro         # 6 agent-kort med hover-glow
    │   ├── Leveranser.astro      # Case-cards med vertikalt flytdiagram
    │   ├── Prosess.astro         # Tech-konsepter (Claude, MCP, Pinecone, RAG)
    │   ├── CTA.astro             # Dark CTA-kort
    │   └── Footer.astro          # 4-kol footer
    ├── pages/
    │   ├── index.astro           # /
    │   └── agent/[slug].astro    # /agent/loki, /agent/nova, ...
    └── styles/global.css         # Tailwind + premium design tokens
```

## Hva er nytt vs. forrige versjon

- **Editorial display-font** (Instrument Serif) for kuratorisk preg på headlines
- **Mesh gradient + noise** i hero for premium-tekstur
- **Hover-glow** på agent-kort (radial-gradient inni hver kort)
- **"Bygget på"-vendor-strip** (Trust-komponent) under hero
- **Større, mer dramatiske headlines** med italic-accent
- **Glassmorphism** i nav med backdrop-blur
- **Premium box-shadows** på primær-knapper
- **Konsistent design-language** gjennom alle seksjoner

## Lisens

© 2026 BYGG-KON AS.
