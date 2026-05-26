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
    role: 'Intern kunnskap — OneDrive & bedriftsdatabase',
    tagline: 'Filene våre, gjort lesbare for AI.',
    description: 'Loki henter filer fra OneDrive og bedriftens database, og preparerer dem slik at språkmodeller kan lese og forstå alt innholdet — fra PDF-er og tegninger til regneark og notater. Resultatet er at hele bedriftens kunnskap blir søkbar med naturlig språk.',
    status: 'live', color: '#c8102e', colorClass: 'loki',
    meta: 'Vektordatabase · MCP · Tenant-wide',
    pipeline: [
      { i: '🔍', n: 'Discovery',   d: 'Tenant-wide enumerering av kilder' },
      { i: '🔄', n: 'Delta sync',  d: 'Inkrementell, hver 10. min' },
      { i: '📄', n: 'Parser',      d: 'PDF, Word, tegninger, regneark' },
      { i: '🧮', n: 'Embedding',   d: 'Tekst → vektor-representasjon' },
      { i: '🗄️', n: 'Vektor-DB',   d: 'Semantisk søkbar indeks' }
    ],
    details: [
      { k: 'Arkitektur',  v: 'Container-basert mikrotjeneste' },
      { k: 'Lagring',     v: 'Vektordatabase · høy-dimensjonal' },
      { k: 'Embeddings',  v: 'Tekst-embedding-modell (SOTA)' },
      { k: 'Parser',      v: 'PDF · DOCX · XLSX · tegninger' },
      { k: 'Kilder',      v: 'OneDrive + SharePoint (tenant-wide)' },
      { k: 'Synkronisering', v: 'Inkrementell delta-sync · hvert 10. min' },
      { k: 'Tilgang',     v: 'Admin-UI + MCP-server' }
    ],
    url: 'https://byggkon-loki-ai-production.up.railway.app/'
  },
  {
    slug: 'nova', num: '02', name: 'Nova',
    role: 'Kunnskapsagent for byggebransjen',
    tagline: 'Faglig kontekst og bransjepraksis, på spørsmål.',
    description: 'Nova er en kunnskapsagent spesialisert på byggebransjen. Hun gir ansatte tilgang til faglig kontekst, regelverk og bransjepraksis gjennom samme samtalegrensesnitt som de allerede bruker — chat, Teams eller e-post.',
    status: 'live', color: '#f5b400', colorClass: 'nova',
    meta: 'Bransjekunnskap · Multi-kanal',
    pipeline: [
      { i: '📩', n: 'Mottak',      d: 'Chat · Teams · e-post · webhook' },
      { i: '📎', n: 'Vedlegg',     d: 'PDF, Word, Excel, CSV parses' },
      { i: '🔎', n: 'Kunnskapssøk', d: 'Semantisk søk i bransjekunnskap' },
      { i: '🧠', n: 'Generering',  d: 'Svar tilpasset kanal og kontekst' },
      { i: '↩️', n: 'Levering',    d: 'Tilbake til samme kanal' }
    ],
    details: [
      { k: 'Domene',       v: 'Bygg- og anleggsfaget' },
      { k: 'Kanaler',      v: 'Chat · Teams · e-post · webhook' },
      { k: 'Lagring',      v: 'Vektordatabase for bransjekunnskap' },
      { k: 'LLM',          v: 'Konfigurerbar — Claude, GPT, m.fl.' },
      { k: 'Sikkerhet',    v: 'Kryptert credential-lagring' },
      { k: 'Tilgang',      v: 'Admin-UI + MCP-server' }
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
