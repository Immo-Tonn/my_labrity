#!/usr/bin/env node
// SEO smoke test (no dependencies). Usage:
//   BASE_URL=http://localhost:3000 npm run seo:smoke
// Crawls every <loc> of sitemap.xml and checks the server-rendered HTML.

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(
  /\/+$/,
  '',
);
const HREFLANGS = ['de', 'en', 'uk', 'ru', 'x-default'];
const CONCURRENCY = 6;

const problems = [];
const fail = (url, msg) => problems.push(`${url}  ${msg}`);

// Sitemap URLs may point at the production domain; fetch them from BASE_URL.
const toLocal = url => {
  try {
    const u = new URL(url);
    return `${BASE_URL}${u.pathname}${u.search}`;
  } catch {
    return url;
  }
};
const pathOf = url => {
  try {
    return new URL(url).pathname.replace(/\/+$/, '') || '/';
  } catch {
    return url;
  }
};

const decode = s =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(m => {
    const attrs = {};
    for (const a of m[0].matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) {
      attrs[a[1].toLowerCase()] = decode(a[2]);
    }
    return attrs;
  });
}

const metaContent = (html, key) =>
  tags(html, 'meta').find(
    m => (m.name === key || m.property === key) && m.content,
  )?.content;

function collectTypes(node, out) {
  if (Array.isArray(node)) return node.forEach(n => collectTypes(n, out));
  if (node && typeof node === 'object') {
    if (node['@type']) [].concat(node['@type']).forEach(t => out.add(t));
    Object.values(node).forEach(v => collectTypes(v, out));
  }
}

async function get(url) {
  return fetch(url, {
    redirect: 'manual',
    headers: { 'user-agent': 'seo-smoke' },
  });
}

async function checkPage(loc, hreflangMap) {
  const res = await get(toLocal(loc));
  if (res.status !== 200) return fail(loc, `status ${res.status}`);
  const html = await res.text();

  const h1 = (html.match(/<h1\b/gi) || []).length;
  if (h1 !== 1) fail(loc, `expected 1 <h1>, found ${h1}`);

  const links = tags(html, 'link');
  const canonical = links.find(l => l.rel === 'canonical')?.href;
  if (!canonical) fail(loc, 'no canonical');
  else if (canonical !== loc) fail(loc, `canonical is not self: ${canonical}`);

  const alt = Object.fromEntries(
    links
      .filter(l => l.rel === 'alternate' && l.hreflang)
      .map(l => [l.hreflang, l.href]),
  );
  for (const code of HREFLANGS) {
    if (!alt[code]) fail(loc, `missing hreflang ${code}`);
  }
  const own = Object.values(alt).some(h => pathOf(h) === pathOf(loc));
  if (!own) fail(loc, 'hreflang set does not include the page itself');
  // reciprocity: every alternate lists the same set
  for (const code of HREFLANGS) {
    const target = alt[code];
    if (!target) continue;
    const other = hreflangMap.get(pathOf(target));
    if (!other) {
      fail(loc, `hreflang ${code} target not in sitemap: ${target}`);
      continue;
    }
    for (const c of HREFLANGS) {
      if (pathOf(other[c] || '') !== pathOf(alt[c] || ''))
        fail(loc, `hreflang not reciprocal with ${target} (${c})`);
    }
  }

  if (!metaContent(html, 'description')) fail(loc, 'no meta description');
  if (!metaContent(html, 'og:image')) fail(loc, 'no og:image');
  if (!metaContent(html, 'twitter:image')) fail(loc, 'no twitter:image');
  const robots = metaContent(html, 'robots') || '';
  if (/noindex/i.test(robots)) fail(loc, `noindex: ${robots}`);

  const types = new Set();
  const blocks = [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  if (!blocks.length) fail(loc, 'no JSON-LD');
  for (const b of blocks) {
    try {
      collectTypes(JSON.parse(b[1]), types);
    } catch {
      fail(loc, 'JSON-LD does not parse');
    }
  }

  if (!/<nav\b/i.test(html)) fail(loc, 'no <nav> in SSR HTML');
  if (!/<footer\b/i.test(html)) fail(loc, 'no <footer> in SSR HTML');

  return [...types];
}

async function main() {
  const smRes = await get(`${BASE_URL}/sitemap.xml`);
  if (smRes.status !== 200) {
    console.error(`sitemap.xml -> ${smRes.status}`);
    process.exit(1);
  }
  const xml = await smRes.text();
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => {
    const loc = decode(m[1].match(/<loc>([^<]+)<\/loc>/)[1].trim());
    const alt = {};
    for (const a of m[1].matchAll(/<xhtml:link\b[^>]*>/g)) {
      const hl = a[0].match(/hreflang="([^"]+)"/)?.[1];
      const href = a[0].match(/href="([^"]+)"/)?.[1];
      if (hl && href) alt[hl] = decode(href);
    }
    return { loc, alt };
  });
  console.log(`BASE_URL ${BASE_URL}: ${entries.length} URLs in sitemap`);

  const hreflangMap = new Map(entries.map(e => [pathOf(e.loc), e.alt]));
  for (const e of entries) {
    for (const code of HREFLANGS)
      if (!e.alt[code]) fail(e.loc, `sitemap alternates missing ${code}`);
  }

  const queue = [...entries];
  const summary = [];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const { loc } = queue.shift();
        try {
          const types = await checkPage(loc, hreflangMap);
          summary.push([loc, (types || []).join(',')]);
        } catch (e) {
          fail(loc, `request failed: ${e.message}`);
        }
      }
    }),
  );

  summary.sort((a, b) => a[0].localeCompare(b[0]));
  for (const [loc, t] of summary) console.log(`  ${pathOf(loc)}  [${t}]`);

  if (problems.length) {
    console.error(`\n${problems.length} problem(s):`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log('\nAll checks passed.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
