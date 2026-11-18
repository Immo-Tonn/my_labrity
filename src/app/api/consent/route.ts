// Consent log (Einwilligungsnachweis, Art. 7(1) DSGVO).
//
// Every first cookie choice and every later change is recorded with a random
// consent ID (the one vanilla-cookieconsent stores in the visitor's own
// consent cookie), a server timestamp, the choice, the banner revision and the
// language. Deliberately NOT stored: IP address, user agent, any other
// identifier. The ID cannot be traced back to a person without the visitor's
// own browser.
//
// Storage: a dedicated, private Telegram chat (TELEGRAM_CONSENT_CHAT_ID, sent by
// TELEGRAM_CONSENT_BOT_TOKEN or, if unset, TELEGRAM_BOT_TOKEN) as an
// append-only archive, plus a structured line in the hosting logs. Without
// TELEGRAM_CONSENT_CHAT_ID only the hosting log is written (short retention),
// and a warning is logged.

const MAX_CONTENT_LENGTH = 2_000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_PER_IP = 12;
const RATE_MAX_GLOBAL = 300;

const LANGS = ['de', 'en', 'ru', 'ua'];
const ACCEPT_TYPES = ['all', 'necessary', 'custom'];
const TRIGGERS = ['first', 'change'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ipLog = new Map<string, number[]>();
let globalLog: number[] = [];
const seen = new Map<string, number>();

function allowedOrigins(): string[] {
  const origins = new Set<string>([
    'https://www.labrity.com',
    'https://labrity.com',
  ]);
  for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) {
    if (host) origins.add(`https://${host}`);
  }
  for (const extra of (process.env.FORM_EXTRA_ORIGINS ?? '').split(',')) {
    if (extra.trim()) origins.add(extra.trim());
  }
  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:3000');
    origins.add('http://127.0.0.1:3000');
  }
  return Array.from(origins);
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function rateLimited(key: string): boolean {
  const start = Date.now() - RATE_WINDOW_MS;
  const list = (ipLog.get(key) ?? []).filter(t => t > start);
  list.push(Date.now());
  ipLog.set(key, list);
  globalLog = globalLog.filter(t => t > start);
  globalLog.push(Date.now());

  if (ipLog.size > 5000) {
    for (const [k, v] of ipLog) {
      if (v[v.length - 1] < start) ipLog.delete(k);
    }
  }

  return list.length > RATE_MAX_PER_IP || globalLog.length > RATE_MAX_GLOBAL;
}

const bad = (reason: string, status: number) =>
  new Response(JSON.stringify({ error: reason }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || !allowedOrigins().includes(origin)) return bad('origin', 403);

  if (rateLimited(clientKey(request))) {
    return new Response(null, {
      status: 429,
      headers: { 'Retry-After': String(RATE_WINDOW_MS / 1000) },
    });
  }

  if (!(request.headers.get('content-type') ?? '').includes('json')) {
    return bad('content-type', 415);
  }
  if (Number(request.headers.get('content-length') ?? 0) > MAX_CONTENT_LENGTH) {
    return bad('too-large', 413);
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== 'object' || parsed === null) return bad('body', 400);
    body = parsed as Record<string, unknown>;
  } catch {
    return bad('bad-json', 400);
  }

  const { consentId, acceptType, analytics, revision, lang, path, trigger } =
    body;

  if (
    typeof consentId !== 'string' ||
    !UUID.test(consentId) ||
    typeof acceptType !== 'string' ||
    !ACCEPT_TYPES.includes(acceptType) ||
    typeof analytics !== 'boolean' ||
    typeof revision !== 'number' ||
    !Number.isInteger(revision) ||
    typeof lang !== 'string' ||
    !LANGS.includes(lang) ||
    typeof path !== 'string' ||
    !path.startsWith('/') ||
    path.length > 120 ||
    typeof trigger !== 'string' ||
    !TRIGGERS.includes(trigger)
  ) {
    return bad('invalid', 400);
  }

  // Same ID + same choice within a minute: acknowledge, do not log twice.
  const dedupeKey = `${consentId}:${acceptType}:${analytics}`;
  const now = Date.now();
  for (const [k, t] of seen) {
    if (now - t > 60_000) seen.delete(k);
  }
  if (seen.has(dedupeKey)) return new Response(null, { status: 200 });
  seen.set(dedupeKey, now);

  const entry = {
    time: new Date(now).toISOString(),
    consentId,
    trigger,
    acceptType,
    analytics,
    revision,
    lang,
    path,
  };

  // Hosting log (structured, greppable). Short retention, so not the archive.
  console.log('[consent-log]', JSON.stringify(entry));

  const chatId = process.env.TELEGRAM_CONSENT_CHAT_ID?.trim();
  // A dedicated bot is preferred; the form bot is the fallback.
  const botToken =
    process.env.TELEGRAM_CONSENT_BOT_TOKEN?.trim() ||
    process.env.TELEGRAM_BOT_TOKEN?.trim();

  if (!chatId || !botToken) {
    console.warn(
      '[consent-log] TELEGRAM_CONSENT_CHAT_ID/TELEGRAM_BOT_TOKEN not set: entry kept only in the hosting log',
    );
    return new Response(null, { status: 200 });
  }

  if (process.env.FORM_DRY_RUN === '1')
    return new Response(null, { status: 200 });

  const text = [
    `🍪 Consent ${entry.trigger === 'first' ? 'erteilt' : 'geändert'}`,
    `time: ${entry.time}`,
    `id: ${entry.consentId}`,
    `choice: ${entry.acceptType} (analytics: ${entry.analytics ? 'yes' : 'no'})`,
    `banner revision: ${entry.revision}`,
    `lang: ${entry.lang}, page: ${entry.path}`,
  ].join('\n');

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!response.ok) {
      console.error(`[consent-log] telegram error ${response.status}`);
    }
  } catch {
    console.error('[consent-log] telegram request failed');
  }

  // The visitor's choice never depends on the log succeeding.
  return new Response(null, { status: 200 });
}
