const MAX_CONTENT_LENGTH = 10_000; // bytes, well above any legitimate contact-form payload
const MAX_MESSAGE_LENGTH = 4000; // stays under Telegram's own 4096-char message limit

// Best-effort, per-instance rate limit. This Map lives in the memory of a single
// serverless function instance: it resets on cold start and is NOT shared across
// concurrent/parallel instances or regions, so it cannot guarantee a hard global
// limit on Vercel. It still meaningfully raises the bar against a single script
// hammering the endpoint from one warm instance. A real, distributed guarantee
// needs platform-level infrastructure (e.g. Vercel Firewall rules, or an external
// store like Upstash Redis) that isn't configured here — see the audit report.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  const timestamps = (requestLog.get(key) ?? []).filter(t => t > windowStart);
  timestamps.push(now);
  requestLog.set(key, timestamps);

  // Opportunistically drop fully-expired keys so the map doesn't grow forever
  // on a long-lived warm instance.
  if (requestLog.size > 5000) {
    for (const [k, v] of requestLog) {
      if (v.every(t => t <= windowStart)) requestLog.delete(k);
    }
  }

  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  return request.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request);

  if (isRateLimited(clientKey)) {
    return new Response(null, {
      status: 429,
      headers: { 'Retry-After': String(RATE_LIMIT_WINDOW_MS / 1000) },
    });
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return new Response(null, { status: 415 });
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_CONTENT_LENGTH) {
    return new Response(null, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('message' in body) ||
    typeof (body as { message: unknown }).message !== 'string'
  ) {
    return new Response(null, { status: 400 });
  }

  const message = (body as { message: string }).message.trim();

  if (message.length === 0 || message.length > MAX_MESSAGE_LENGTH) {
    return new Response(null, { status: 400 });
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
          text: message,
        }),
      },
    );
  } catch {
    return new Response(null, { status: 502 });
  }

  if (!response.ok) {
    return new Response(null, { status: 502 });
  }

  return new Response(null, { status: 200 });
}
