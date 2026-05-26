export type AgentStatus = 'live' | 'beta';

export type Agent = {
  slug: string;
  num: string;
  name: string;
  role: string;
  tagline: string;
  description: string;
  status: AgentStatus;
  color: string;
  colorClass: string;
  meta: string;
  pipeline: { i: string; n: string; d: string }[];
  details: { k: string; v: string }[];
  url?: string;
};

export const agents: Agent[] = [
  {
    slug: 'loki', num: '01', name: 'Loki',
    role: 'Kunnskapsmotor — OneDrive + SharePoint',
    tagline: 'Hele tenant-en søkbar via vektorindeks.',
    description: 'Loki synkroniserer hele BYGG-KONs OneDrive og SharePoint tenant-wide til en Pinecone-vektorindeks. Alle filer parses, embeddes og blir søkbare — du kan spørre "hva har vi gjort av tilsvarende prosjekter de siste 5 årene?" og få treff på faktisk innhold, ikke bare filnavn.',
    status: 'beta', color: '#c8102e', colorClass: 'loki',
    meta: 'Pinecone · OpenAI · Tenant-wide',
    pipeline: [
      { i: '🔍', n: 'Discovery',  d: 'Tenant-wide drive-enumerering' },
      { i: '🔄', n: 'Delta sync', d: 'Per-drive, hver 10. min' },
      { i: '📄', n: 'Parser',     d: 'Unstructured · hi_res for PDF' },
      { i: '🧮', n: 'Embedding',  d: 'OpenAI text-embedding-3-large' },
      { i: '🗄️', n: 'Pinecone',   d: 'Vektorindeks, søkbar' }
    ],
    details: [
      { k: 'Stack',       v: 'Python · FastAPI · Docker' },
      { k: 'Vektorstore', v: 'Pinecone · 1536-dim' },
      { k: 'Embeddings',  v: 'OpenAI text-embedding-3-large' },
      { k: 'Parser',      v: 'Unstructured (PDF, DOCX, m.fl.)' },
      { k: 'Kilder',      v: 'OneDrive + SharePoint via Microsoft Graph' },
      { k: 'Tilgang',     v: 'Admin-UI + MCP-server (loki-mcp)' }
    ],
    url: 'https://byggkon-loki-ai-production.up.railway.app/'
  },
  {
    slug: 'nova', num: '02', name: 'Nova',
    role: 'Multi-kanal AI-assistent',
    tagline: 'Nova svarer i chat, Teams, e-post og webhook.',
    description: 'Nova er en RAG-basert AI-assistent som svarer på spørsmål fra ansatte via chat, Microsoft Teams, e-post (Gmail) eller webhook. Hun indekserer Google Drive nattlig og parser vedlegg fra e-post — PDF, Word, Excel — og bruker det som kontekst når hun genererer svar.',
    status: 'live', color: '#f5b400', colorClass: 'nova',
    meta: 'Pinecone · Multi-kanal RAG',
    pipeline: [
      { i: '📩', n: 'Mottak',      d: 'Chat · Teams · Gmail · webhook' },
      { i: '📎', n: 'Vedlegg',     d: 'PDF, Word, Excel, CSV parses' },
      { i: '🔎', n: 'RAG-søk',     d: 'Pinecone retrieval' },
      { i: '🧠', n: 'Generering',  d: 'OpenAI med kanal-spesifikk prompt' },
      { i: '↩️', n: 'Levering',    d: 'Tilbake til samme kanal' }
    ],
    details: [
      { k: 'Stack',        v: 'Node.js 20 · Express · SQLite' },
      { k: 'Vektorstore',  v: 'Pinecone' },
      { k: 'LLM',          v: 'OpenAI (konfigurerbar modell)' },
      { k: 'Kanaler',      v: 'Chat · Teams · Gmail · webhook' },
      { k: 'Sikkerhet',    v: 'AES-256-GCM kryptert credentials' },
      { k: 'Tilgang',      v: 'Admin-UI + MCP-server (nova-mcp)' }
    ],
    url: 'https://nova-ai-agent-bygg-kon-production.up.railway.app/'
  },
  {
    slug: 'hilde', num: '03', name: 'Hilde',
    role: 'Eiendom og eiendomseiere',
    tagline: 'Hun finner eiendom og eiendomseiere.',
    description: 'Hilde sporer opp riktig eiendom og kobler den til eier. Matrikkeldata, grunnbok og kontaktinformasjon hentes direkte fra Kartverket og Brønnøysund — automatisk og oppdatert.',
    status: 'live', color: '#0a6cf0', colorClass: 'hilde',
    meta: 'Matrikkel · grunnbok',
    pipeline: [
      { i: '📍', n: 'Input',         d: 'Adresse, gnr/bnr eller område' },
      { i: '🗺️', n: 'Kartverket',    d: 'Matrikkel og grunnbok' },
      { i: '🏢', n: 'Brønnøysund',   d: 'Eier og selskap' },
      { i: '📊', n: 'Aggregator',    d: 'Konsolidert dossier' },
      { i: '🗺️', n: 'hilde-mcp',     d: 'Servert til Claude' }
    ],
    details: [
      { k: 'Kilder',  v: 'Kartverket · Brønnøysund · Geonorge' },
      { k: 'Søk',     v: 'Adresse · matrikkel · område' },
      { k: 'Output',  v: 'Eier · pant · heftelser · kontakt' },
      { k: 'Tilgang', v: 'Via Claude · ChatGPT · Gemini' }
    ],
    url: 'https://byggkon.bluemint.dev/'
  },
  {
    slug: 'tripletex', num: '04', name: 'Tripletex',
    role: 'Økonomi via MCP',
    tagline: 'Økonomisystemet eksponert som verktøy i samtalen.',
    description: 'Tripletex er koblet direkte inn via Model Context Protocol. Faktura, regnskap, prosjektøkonomi og timeføring blir tilgjengelig som verktøy Claude kan bruke i sanntid — alltid med bekreftelse før skriveoperasjoner.',
    status: 'live', color: '#7a3fc8', colorClass: 'tt',
    meta: 'OAuth · 35+ MCP-verktøy',
    pipeline: [
      { i: '🔑', n: 'OAuth',       d: 'Sikker autentisering' },
      { i: '🌐', n: 'REST API',    d: 'Tripletex v2' },
      { i: '🧰', n: 'MCP Tools',   d: '35+ verktøy eksponert' },
      { i: '🛡️', n: 'Rate-limit',  d: 'Token-bucket og cache' },
      { i: '💼', n: 'tripletex-mcp', d: 'Til LLM' }
    ],
    details: [
      { k: 'Operasjoner', v: 'Faktura · ordre · regnskap · timer' },
      { k: 'Modus',       v: 'Lese og skrive (med bekreftelse)' },
      { k: 'Sanntid',     v: 'Direkte mot Tripletex Live' },
      { k: 'Tilgang',     v: 'Bygd som MCP — Claude-native' }
    ]
  },
  {
    slug: 'epost', num: '05', name: 'Epostagent',
    role: 'Kunnskapsdeling via e-post',
    tagline: 'Ingen svarer på samme spørsmål to ganger.',
    description: 'Epostagenten lærer av hvert svar som blir gitt. Når et lignende spørsmål kommer inn fra kunde, byggherre eller intern — har systemet allerede et forslag basert på hvordan kollegaen din svarte forrige gang.',
    status: 'live', color: '#ff6b35', colorClass: 'fx',
    meta: 'IMAP · M365',
    pipeline: [
      { i: '📥', n: 'Inbox',          d: 'Microsoft 365 og IMAP' },
      { i: '🏷️', n: 'Klassifisering', d: 'Type, prioritet, prosjekt' },
      { i: '🧠', n: 'Kontekst',       d: 'Tråd og Loki-oppslag' },
      { i: '✍️', n: 'Drafting',       d: 'I ansattes egen stemme' },
      { i: '📬', n: 'epost-mcp',      d: 'Triage og svar' }
    ],
    details: [
      { k: 'Kobling', v: 'Microsoft 365 · Gmail · IMAP' },
      { k: 'Læring',  v: 'Stil per ansatt — fra historikk' },
      { k: 'Oppgaver',v: 'Konverterer e-post til to-do' },
      { k: 'Møter',   v: 'Oppsummerer og følger opp' }
    ]
  },
  {
    slug: 'ki-tilbud', num: '06', name: 'KI Tilbud',
    role: 'Anbud og tilbud',
    tagline: 'Fra forespørsel til signaturklart tilbud — på minutter.',
    description: 'KI Tilbud kombinerer Loki, Nova og Tripletex til å produsere komplette tilbud etter NS 8400 og NS 3450. Referanser fra tidligere prosjekter, regelverkskrav og timepriser knyttes sammen automatisk.',
    status: 'beta', color: '#1f8a3a', colorClass: 'ki',
    meta: 'NS 8400 · NS 3450',
    pipeline: [
      { i: '📨', n: 'Forespørsel',  d: 'Doseanmodning eller BVP' },
      { i: '📚', n: 'Loki + Nova',  d: 'Referanser og krav' },
      { i: '💰', n: 'Tripletex',    d: 'Timepriser og påslag' },
      { i: '📐', n: 'Kalkulasjon',  d: 'NS 3450 med risiko' },
      { i: '📄', n: 'Tilbudsdok',   d: 'PDF, signaturklar' }
    ],
    details: [
      { k: 'Standarder', v: 'NS 8400 · NS 8401 · NS 3450' },
      { k: 'Output',     v: 'Komplett tilbud · vedlegg · risiko' },
      { k: 'Tid',        v: 'Fra dager til timer' },
      { k: 'Kobling',    v: 'Bruker Loki, Nova og Tripletex' }
    ],
    url: 'https://bk-tilbud.aiki.as/login'
  }
];

export function getAgent(slug: string): Agent | undefined {
  return agents.find(a => a.slug === slug);
}
