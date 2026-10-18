import { createHash, createHmac, timingSafeEqual } from 'crypto';

// INTERIM anti-bot guard for the contact / quiz forms (no external service).
// Layers: Origin check -> per-IP + global rate limit -> honeypot -> signed,
// time-limited form token (must be fetched via GET and "aged" >= MIN_AGE_MS)
// -> content sanity checks -> duplicate suppression -> Telegram.
// This is a stop-gap: a real CAPTCHA (e.g. Cloudflare Turnstile) is the proper
// fix. Rejections are logged with a reason code only (no personal data).

const MAX_CONTENT_LENGTH = 10_000;
const MAX_MESSAGE_LENGTH = 4000;
const MIN_MESSAGE_LENGTH = 30;

const TOKEN_MIN_AGE_MS = 2_000;
const TOKEN_MAX_AGE_MS = 2 * 60 * 60 * 1000;

const RATE_WINDOW_MS = 10 * 60 * 1000;
// Attempts (any POST that passed the Origin check) are limited loosely so a
// real person who needs a retry is never blocked; actual forwards to Telegram
// are limited strictly.
const RATE_MAX_ATTEMPTS_PER_IP = 20;
const RATE_MAX_SENDS_PER_IP = 3;
const RATE_MAX_SENDS_GLOBAL = 25;

// Best-effort, per serverless instance (resets on cold start, not shared
// across instances). Raises the bar; it is not a hard global limit.
const attemptLog = new Map<string, number[]>();
const sendLog = new Map<string, number[]>();
let globalSendLog: number[] = [];
const recentHashes = new Map<string, number>();

// Dedicated signing secret for the anti-bot form token. It is intentionally
// NOT derived from TELEGRAM_BOT_TOKEN. Set FORM_SIGNING_SECRET in the hosting
// environment (a long random string, e.g. `openssl rand -base64 48`); never
// commit its value. If it is missing the token layer is skipped (fail-open, so
// real customers can still write to you) and a warning is logged; Origin check,
// honeypot, content checks and rate limits stay active.
function getSecret(): string {
  return process.env.FORM_SIGNING_SECRET?.trim() ?? '';
}

let warnedMissingSecret = false;
function warnIfNoSecret(): void {
  if (!getSecret() && !warnedMissingSecret) {
    warnedMissingSecret = true;
    console.warn(
      '[telegram-guard] FORM_SIGNING_SECRET is not set: form token check is disabled',
    );
  }
}

function sign(issuedAt: string): string {
  return createHmac('sha256', getSecret()).update(issuedAt).digest('base64url');
}

function createToken(): { token: string; issuedAt: number } {
  const issuedAt = Date.now();
  return { token: `${issuedAt}.${sign(String(issuedAt))}`, issuedAt };
}

function checkToken(token: unknown): 'ok' | 'invalid' | 'too-fast' | 'expired' {
  warnIfNoSecret();
  if (!getSecret()) return 'ok';
  if (typeof token !== 'string') return 'invalid';

  const [issued, signature] = token.split('.');
  if (!issued || !signature || !/^\d{10,16}$/.test(issued)) return 'invalid';

  const expected = Buffer.from(sign(issued));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return 'invalid';
  }

  const age = Date.now() - Number(issued);
  if (age < TOKEN_MIN_AGE_MS) return 'too-fast';
  if (age > TOKEN_MAX_AGE_MS) return 'expired';
  return 'ok';
}

function getAllowedOrigins(): string[] {
  const origins = new Set<string>([
    'https://www.labrity.com',
    'https://labrity.com',
  ]);
  for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) {
    if (host) origins.add(`https://${host}`);
  }
  // Optional: extra allowed origins, comma separated (e.g. a preview domain).
  for (const extra of (process.env.FORM_EXTRA_ORIGINS ?? '').split(',')) {
    if (extra.trim()) origins.add(extra.trim());
  }
  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:3000');
    origins.add('http://127.0.0.1:3000');
  }
  return Array.from(origins);
}

function isAllowedOrigin(request: Request): boolean {
  // Browsers always send Origin on cross-origin and fetch() POSTs.
  const origin = request.headers.get('origin');
  return !!origin && getAllowedOrigins().includes(origin);
}

function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function recent(map: Map<string, number[]>, key: string): number[] {
  const windowStart = Date.now() - RATE_WINDOW_MS;
  const list = (map.get(key) ?? []).filter(t => t > windowStart);
  map.set(key, list);
  return list;
}

function tooManyAttempts(key: string): boolean {
  const list = recent(attemptLog, key);
  list.push(Date.now());

  if (attemptLog.size > 5000) {
    for (const [k, v] of attemptLog) {
      if (v.length === 0 || v[v.length - 1] < Date.now() - RATE_WINDOW_MS) {
        attemptLog.delete(k);
      }
    }
  }

  return list.length > RATE_MAX_ATTEMPTS_PER_IP;
}

function tooManySends(key: string): boolean {
  const windowStart = Date.now() - RATE_WINDOW_MS;
  globalSendLog = globalSendLog.filter(t => t > windowStart);

  return (
    recent(sendLog, key).length >= RATE_MAX_SENDS_PER_IP ||
    globalSendLog.length >= RATE_MAX_SENDS_GLOBAL
  );
}

function registerSend(key: string): void {
  recent(sendLog, key).push(Date.now());
  globalSendLog.push(Date.now());
}

function reject(reason: string, status: number, request: Request) {
  console.warn(
    `[telegram-guard] rejected: ${reason}`,
    JSON.stringify({
      origin: request.headers.get('origin') ?? null,
      ua: (request.headers.get('user-agent') ?? '').slice(0, 60),
    }),
  );
  return new Response(JSON.stringify({ error: reason }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function looksLikeSpam(message: string): boolean {
  const links = message.match(/https?:\/\/|www\./gi) ?? [];
  if (links.length > 2) return true;

  // Long runs of consonants / no spaces look like keyboard-mash bots.
  if (/[^\s]{60,}/.test(message)) return true;

  return false;
}

export async function GET() {
  warnIfNoSecret();

  // Without a secret there is nothing to sign: tell the client to send no token.
  const payload = getSecret()
    ? createToken()
    : { token: null, issuedAt: Date.now() };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return reject('origin', 403, request);

  if (tooManyAttempts(getClientKey(request))) {
    return new Response(null, {
      status: 429,
      headers: { 'Retry-After': String(RATE_WINDOW_MS / 1000) },
    });
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return reject('content-type', 415, request);
  }

  if (Number(request.headers.get('content-length') ?? 0) > MAX_CONTENT_LENGTH) {
    return reject('too-large', 413, request);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reject('bad-json', 400, request);
  }

  if (typeof body !== 'object' || body === null) {
    return reject('bad-body', 400, request);
  }

  const { message, token, website } = body as {
    message?: unknown;
    token?: unknown;
    website?: unknown;
  };

  // Honeypot: real visitors never fill the hidden field. Pretend success so
  // the bot does not learn anything, but send nothing.
  if (typeof website === 'string' && website.trim() !== '') {
    console.warn('[telegram-guard] honeypot filled');
    return new Response(null, { status: 200 });
  }

  const tokenState = checkToken(token);
  if (tokenState !== 'ok') return reject(`token-${tokenState}`, 403, request);

  if (typeof message !== 'string') return reject('bad-message', 400, request);

  const text = message.trim();
  if (text.length < MIN_MESSAGE_LENGTH || text.length > MAX_MESSAGE_LENGTH) {
    return reject('message-length', 400, request);
  }

  if (looksLikeSpam(text)) return reject('content', 400, request);

  if (tooManySends(getClientKey(request))) {
    return new Response(null, {
      status: 429,
      headers: { 'Retry-After': String(RATE_WINDOW_MS / 1000) },
    });
  }

  // Identical message within an hour: acknowledge, do not forward again.
  const hash = createHash('sha256').update(text).digest('hex');
  const now = Date.now();
  for (const [h, t] of recentHashes) {
    if (now - t > 60 * 60 * 1000) recentHashes.delete(h);
  }
  if (recentHashes.has(hash)) {
    console.warn('[telegram-guard] duplicate suppressed');
    return new Response(null, { status: 200 });
  }
  recentHashes.set(hash, now);
  registerSend(getClientKey(request));

  // Preview/testing aid: run every check but do not contact Telegram.
  // Never set FORM_DRY_RUN in production.
  if (process.env.FORM_DRY_RUN === '1') {
    console.warn('[telegram-guard] dry run: message accepted, not sent');
    return new Response(null, { status: 200 });
  }

  let response: Response;
  try {
    response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text,
        }),
        signal: AbortSignal.timeout(15_000),
      },
    );
  } catch {
    recentHashes.delete(hash);
    return new Response(null, { status: 502 });
  }

  if (!response.ok) {
    recentHashes.delete(hash);
    console.error(`[telegram-guard] telegram error ${response.status}`);
    return new Response(null, { status: 502 });
  }

  return new Response(null, { status: 200 });
}
