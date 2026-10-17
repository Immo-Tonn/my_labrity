// Client side of the contact / quiz forms. Works together with the guard in
// src/app/api/telegram/route.ts: a signed token (fetched when the form shows
// up) must be at least ~2 s old, and the hidden honeypot field must be empty.

const MIN_TOKEN_AGE_MS = 2500;

type FormToken = {
  token: string | null;
  issuedAt: number;
  receivedAt: number;
};

let tokenPromise: Promise<FormToken> | null = null;

const fetchToken = async (): Promise<FormToken> => {
  const response = await fetch('/api/telegram', { cache: 'no-store' });

  if (!response.ok) throw new Error('Failed to get form token');

  const data = (await response.json()) as {
    token: string | null;
    issuedAt: number;
  };

  return { token: data.token, issuedAt: data.issuedAt, receivedAt: Date.now() };
};

// Call when a form becomes visible, so the token is already "aged" on submit.
export const prefetchFormToken = (): void => {
  if (!tokenPromise) {
    tokenPromise = fetchToken().catch(() => {
      tokenPromise = null;
      throw new Error('token');
    });
    tokenPromise.catch(() => undefined);
  }
};

const readHoneypot = (): string => {
  const field = document.querySelector<HTMLInputElement>('input[data-hp]');

  return field?.value ?? '';
};

const post = async (message: string, token: string | null): Promise<Response> =>
  fetch('/api/telegram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, token, website: readHoneypot() }),
  });

export const sendMessage = async (message: string): Promise<void> => {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    prefetchFormToken();

    const current = await (tokenPromise as Promise<FormToken>);
    const wait = MIN_TOKEN_AGE_MS - (Date.now() - current.receivedAt);

    if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));

    const response = await post(message, current.token);

    if (response.ok) return;

    // Token expired or rejected: get a fresh one and try once more.
    if (response.status === 403 && attempt === 0) {
      tokenPromise = null;
      continue;
    }

    throw new Error('Failed to send message');
  }

  throw new Error('Failed to send message');
};
