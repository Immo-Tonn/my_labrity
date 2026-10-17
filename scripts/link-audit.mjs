#!/usr/bin/env node
// Internal link / sitemap / hreflang / canonical audit (no dependencies).
// Usage:
//   BASE_URL=http://localhost:3000 OUT_DIR=./link-audit-out npm run links:audit
// Crawls raw server HTML only (no JS), so client-only links are NOT seen.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(
  /\/+$/,
  '',
);
const OUT_DIR = process.env.OUT_DIR || 'link-audit-out';
const CONCURRENCY = 8;
const MAX_DEPTH_OK = 3;
const PREFIXED = ['en', 'ru', 'ua'];
const LOCALES = ['de', 'en', 'ru', 'ua'];
const HREFLANG_OF = { de: 'de', en: 'en', ru: 'ru', ua: 'uk' };
const HREFLANGS = ['de', 'en', 'ru', 'uk', 'x-default'];

const issues = []; // {type, url, source, detail}
const add = (type, url, detail, source = '') =>
  issues.push({ type, url, source, detail });

const decode = s =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

function parseAttrs(tag) {
  const attrs = {};
  for (const a of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    attrs[a[1].toLowerCase()] = decode(a[2] ?? a[3] ?? '');
  }
  return attrs;
}
const tags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(m =>
    parseAttrs(m[0]),
  );
const metaContent = (html, key) =>
  tags(html, 'meta').find(
    m => (m.name === key || m.property === key) && m.content != null,
  )?.content;

const normPath = p => {
  const x = p.replace(/\/+$/, '');
  return x === '' ? '/' : x;
};
const localeOf = path => {
  const seg = path.split('/')[1];
  return PREFIXED.includes(seg) ? seg : 'de';
};
const stripLocale = path => {
  const seg = path.split('/')[1];
  if (PREFIXED.includes(seg)) return normPath(path.slice(seg.length + 1));
  return path;
};
const pathOf = url => {
  try {
    return normPath(new URL(url).pathname);
  } catch {
    return url;
  }
};
const get = (path, init = {}) =>
  fetch(BASE_URL + path, {
    redirect: 'manual',
    headers: { 'user-agent': 'link-audit' },
    ...init,
  });

async function pool(items, worker) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const it = queue.shift();
        try {
          await worker(it);
        } catch (e) {
          add('request-failed', String(it), e.message);
        }
      }
    }),
  );
}

// ---------- sitemap ----------
const smRes = await get('/sitemap.xml');
if (smRes.status !== 200) {
  console.error(`sitemap.xml -> ${smRes.status}`);
  process.exit(1);
}
const xml = await smRes.text();
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => {
  const loc = decode(m[1].match(/<loc>([^<]+)<\/loc>/)[1].trim());
  const alt = {};
  for (const a of m[1].matchAll(/<xhtml:link\b[^>]*>/g)) {
    const at = parseAttrs(a[0]);
    if (at.hreflang && at.href) alt[at.hreflang] = at.href;
  }
  return { loc, path: pathOf(loc), alt };
});
const siteHost = new URL(entries[0].loc).host;
const siteOrigin = new URL(entries[0].loc).origin;
const baseHost = new URL(BASE_URL).host;
const sitemapPaths = new Set();
for (const e of entries) {
  if (sitemapPaths.has(e.path))
    add('sitemap-duplicate', e.loc, 'duplicate <loc>');
  sitemapPaths.add(e.path);
  let u;
  try {
    u = new URL(e.loc);
  } catch {
    add('sitemap-not-absolute', e.loc, 'loc is not an absolute URL');
    continue;
  }
  if (u.host !== siteHost)
    add('sitemap-host', e.loc, `host ${u.host} != ${siteHost}`);
  if (u.search || u.hash) add('sitemap-query', e.loc, 'query/hash in loc');
  if (e.loc.length > 1 && e.loc.endsWith('/') && u.pathname !== '/')
    add('sitemap-trailing-slash', e.loc, 'trailing slash');
  if (/^\/de(\/|$)/.test(u.pathname))
    add('sitemap-de-prefix', e.loc, '/de prefix');
}

// ---------- fetch pages ----------
/** @type {Map<string, any>} */
const pages = new Map(); // path -> info
const statusCache = new Map(); // path -> {status, location}

async function fetchPage(path) {
  if (pages.has(path)) return pages.get(path);
  const res = await get(path);
  const info = {
    path,
    status: res.status,
    location: res.headers.get('location'),
    links: [],
    html: '',
  };
  pages.set(path, info);
  statusCache.set(path, { status: res.status, location: info.location });
  if (
    res.status === 200 &&
    /text\/html/.test(res.headers.get('content-type') || '')
  ) {
    info.html = await res.text();
    analyze(info);
  }
  return info;
}

function classify(href, fromPath) {
  // returns {kind, path?}
  const h = href.trim();
  if (h === '') return { kind: 'empty' };
  if (h === '#') return { kind: 'hash-only' };
  if (h.startsWith('#')) return { kind: 'fragment' };
  if (/^(mailto:|tel:|sms:|javascript:|data:)/i.test(h)) {
    return /^javascript:/i.test(h) ? { kind: 'javascript' } : { kind: 'other' };
  }
  let u;
  try {
    u = new URL(h, BASE_URL + fromPath);
  } catch {
    return { kind: 'invalid' };
  }
  if (!/^https?:$/.test(u.protocol)) return { kind: 'other' };
  if (u.host !== baseHost && u.host !== siteHost) return { kind: 'external' };
  const hostIsProd = u.host === siteHost && siteHost !== baseHost;
  return {
    kind: 'internal',
    path: normPath(u.pathname) + u.search,
    hostIsProd,
    fragment: u.hash,
  };
}

function analyze(info) {
  const html = info.html;
  // strip scripts/styles/comments to avoid false <a> matches
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  info.h1 = (clean.match(/<h1\b/gi) || []).length;
  const robots = metaContent(html, 'robots') || '';
  info.noindex = /noindex/i.test(robots);
  const links = tags(html, 'link');
  info.canonicals = links.filter(l => l.rel === 'canonical').map(l => l.href);
  info.alternates = links
    .filter(l => l.rel === 'alternate' && l.hreflang)
    .map(l => ({ hreflang: l.hreflang, href: l.href }));
  info.htmlLang = html.match(/<html\b[^>]*\blang="([^"]*)"/i)?.[1];
  // anchors with region guess
  const regions = [];
  for (const m of clean.matchAll(
    /<(header|nav|footer|main)\b|<\/(header|nav|footer|main)>/gi,
  )) {
    regions.push({
      i: m.index,
      open: !!m[1],
      name: (m[1] || m[2]).toLowerCase(),
    });
  }
  const regionAt = idx => {
    const stack = [];
    for (const r of regions) {
      if (r.i > idx) break;
      if (r.open) stack.push(r.name);
      else {
        const k = stack.lastIndexOf(r.name);
        if (k >= 0) stack.splice(k);
      }
    }
    return stack.length ? stack[stack.length - 1] : 'body';
  };
  for (const m of clean.matchAll(/<a\b[^>]*>/gi)) {
    const at = parseAttrs(m[0]);
    if (at.href == null) {
      info.links.push({
        raw: null,
        kind: 'no-href',
        region: regionAt(m.index),
      });
      continue;
    }
    const c = classify(at.href, info.path);
    info.links.push({
      raw: at.href,
      ...c,
      region: regionAt(m.index),
      hreflangAttr: at.hreflang,
      langAttr: at.lang,
      rel: at.rel,
    });
  }
}

// seed: sitemap URLs + 4 homes, then BFS discovery over internal links
const seeds = ['/', '/en', '/ru', '/ua'];
const toFetch = new Set([...seeds, ...sitemapPaths]);
const fetched = new Set();
while (toFetch.size) {
  const batch = [...toFetch].filter(p => !fetched.has(p));
  toFetch.clear();
  if (!batch.length) break;
  await pool(batch, async p => {
    fetched.add(p);
    const info = await fetchPage(p);
    for (const l of info.links) {
      if (l.kind === 'internal' && !fetched.has(l.path.split('?')[0])) {
        toFetch.add(l.path.split('?')[0]);
      }
    }
  });
}

// ---------- sitemap page status ----------
for (const e of entries) {
  const p = pages.get(e.path);
  if (!p) continue;
  if (p.status !== 200)
    add(
      'sitemap-non-200',
      e.loc,
      `status ${p.status}${p.location ? ' -> ' + p.location : ''}`,
    );
  else if (p.noindex)
    add('sitemap-noindex', e.loc, 'noindex page listed in sitemap');
}

// ---------- link graph ----------
const nodes = new Map(); // path -> {path,lang,status,noindex,h1,in,out}
const edges = [];
for (const [path, p] of pages) {
  nodes.set(path, {
    path,
    lang: localeOf(path),
    status: p.status,
    redirect: p.location || undefined,
    noindex: !!p.noindex,
    inSitemap: sitemapPaths.has(path),
    h1: p.h1,
    in: 0,
    out: 0,
  });
}
const outAdj = new Map();
for (const [path, p] of pages) {
  const seen = new Set();
  for (const l of p.links) {
    const where = `${path} [${l.region}] href="${l.raw}"`;
    if (l.kind === 'no-href') continue;
    if (l.kind === 'empty') add('empty-href', path, 'empty href', where);
    else if (l.kind === 'hash-only') add('hash-link', path, 'href="#"', where);
    else if (l.kind === 'javascript')
      add('javascript-href', path, 'javascript: href', where);
    else if (l.kind === 'invalid')
      add('invalid-href', path, 'unparseable href', where);
    else if (l.kind === 'internal') {
      const tp = l.path.split('?')[0];
      if (/^\/de(\/|$)/.test(tp))
        add('de-prefix-link', tp, 'link to /de (redirects 308)', where);
      if (l.hostIsProd)
        add(
          'absolute-prod-host-link',
          l.raw,
          'absolute link to production host (not relative)',
          where,
        );
      const t = pages.get(tp);
      if (!t) add('unknown-target', tp, 'target not fetched', where);
      else if (t.status >= 300 && t.status < 400)
        add('redirect-link', tp, `${t.status} -> ${t.location}`, where);
      else if (t.status !== 200)
        add('broken-link', tp, `status ${t.status}`, where);
      else if (tp !== path || true) {
        const key = `${path}->${tp}`;
        edges.push({ from: path, to: tp, region: l.region, href: l.raw });
        if (!seen.has(key) && tp !== path) {
          seen.add(key);
          outAdj.set(path, [...(outAdj.get(path) || []), tp]);
        }
      }
    }
  }
}
// counters: unique linking pages (excluding self)
const inFrom = new Map();
for (const [from, tos] of outAdj) {
  nodes.get(from).out = tos.length;
  for (const to of tos) {
    if (!inFrom.has(to)) inFrom.set(to, new Set());
    inFrom.get(to).add(from);
  }
}
for (const [to, s] of inFrom) if (nodes.get(to)) nodes.get(to).in = s.size;

// ---------- depth (BFS per language home + global from "/") ----------
function bfs(start) {
  const d = new Map([[start, 0]]);
  const q = [start];
  while (q.length) {
    const c = q.shift();
    for (const n of outAdj.get(c) || []) {
      if (!d.has(n)) {
        d.set(n, d.get(c) + 1);
        q.push(n);
      }
    }
  }
  return d;
}
const homeOf = { de: '/', en: '/en', ru: '/ru', ua: '/ua' };
const depthFromOwn = new Map();
const depthFromRoot = bfs('/');
for (const lang of LOCALES) {
  const d = bfs(homeOf[lang]);
  for (const [p, v] of d) if (localeOf(p) === lang) depthFromOwn.set(p, v);
}
for (const e of entries) {
  const n = nodes.get(e.path);
  if (!n || n.status !== 200) continue;
  n.depth = depthFromOwn.get(e.path);
  n.depthFromRoot = depthFromRoot.get(e.path);
  if (n.depth === undefined)
    add(
      'unreachable-from-home',
      e.loc,
      `not reachable from ${homeOf[n.lang]} via SSR links`,
    );
  else if (n.depth > MAX_DEPTH_OK)
    add('deep-page', e.loc, `click depth ${n.depth} > ${MAX_DEPTH_OK}`);
  if (n.in === 0 && e.path !== homeOf[n.lang])
    add('orphan', e.loc, 'in sitemap, 0 inbound internal links');
}

// ---------- per-page checks ----------
const sitemapAlt = new Map(entries.map(e => [e.path, e.alt]));
for (const e of entries) {
  const p = pages.get(e.path);
  if (!p || p.status !== 200 || !p.html) continue;
  const lang = localeOf(e.path);
  // h1
  if (p.h1 !== 1) add('h1-count', e.loc, `expected 1 <h1>, found ${p.h1}`);
  // canonical
  if (p.canonicals.length !== 1)
    add('canonical-count', e.loc, `${p.canonicals.length} canonical tags`);
  else {
    const c = p.canonicals[0];
    if (!/^https?:\/\//.test(c)) add('canonical-not-absolute', e.loc, c);
    else {
      if (new URL(c).host !== siteHost)
        add('canonical-host', e.loc, `canonical host ${new URL(c).host}`);
      if (normPath(new URL(c).pathname) !== e.path)
        add('canonical-not-self', e.loc, `canonical -> ${c}`);
      if (localeOf(pathOf(c)) !== lang)
        add('canonical-lang-mismatch', e.loc, `canonical -> ${c}`);
    }
  }
  if (p.noindex && p.alternates.length)
    add('hreflang-on-noindex', e.loc, 'hreflang present on noindex page');
  // hreflang
  const alt = {};
  for (const a of p.alternates) {
    if (alt[a.hreflang])
      add('hreflang-duplicate', e.loc, `duplicate hreflang ${a.hreflang}`);
    alt[a.hreflang] = a.href;
  }
  for (const code of HREFLANGS)
    if (!alt[code]) add('hreflang-missing', e.loc, `missing ${code}`);
  const own = alt[HREFLANG_OF[lang]];
  if (own && pathOf(own) !== e.path)
    add('hreflang-self-mismatch', e.loc, `self hreflang -> ${own}`);
  const xd = alt['x-default'];
  if (xd && localeOf(pathOf(xd)) !== 'de')
    add('hreflang-xdefault', e.loc, `x-default -> ${xd}`);
  for (const code of HREFLANGS) {
    const href = alt[code];
    if (!href) continue;
    if (!/^https?:\/\//.test(href))
      add('hreflang-not-absolute', e.loc, `${code}: ${href}`);
    const tp = pathOf(href);
    const t = pages.get(tp);
    if (!t) {
      add('hreflang-target-unknown', e.loc, `${code}: ${href}`);
      continue;
    }
    if (t.status !== 200)
      add('hreflang-target-non-200', e.loc, `${code}: ${href} -> ${t.status}`);
    else if (t.noindex)
      add('hreflang-target-noindex', e.loc, `${code}: ${href}`);
    // reciprocity: target must list us back with the same set
    if (t.status === 200 && t.alternates) {
      const ta = Object.fromEntries(
        t.alternates.map(a => [a.hreflang, a.href]),
      );
      for (const c2 of HREFLANGS) {
        if (pathOf(ta[c2] || '') !== pathOf(alt[c2] || ''))
          add(
            'hreflang-not-reciprocal',
            e.loc,
            `${code} target ${tp} differs on ${c2}`,
          );
      }
    }
  }
  // sitemap alternates vs html
  const sa = sitemapAlt.get(e.path) || {};
  for (const code of HREFLANGS) {
    if (!sa[code])
      add('sitemap-alt-missing', e.loc, `sitemap xhtml:link missing ${code}`);
    else if (alt[code] && pathOf(sa[code]) !== pathOf(alt[code]))
      add(
        'sitemap-vs-html-hreflang',
        e.loc,
        `${code}: sitemap ${sa[code]} vs html ${alt[code]}`,
      );
  }
  // language switcher
  const hasHreflangAnchors = p.links.some(l => l.hreflangAttr || l.langAttr);
  p.switcher = {};
  for (const other of LOCALES) {
    if (other === lang) continue;
    const counterpart = alt[HREFLANG_OF[other]]
      ? pathOf(alt[HREFLANG_OF[other]])
      : null;
    const internal = p.links
      .filter(l => l.kind === 'internal' && !l.hostIsProd)
      .map(l => l.path.split('?')[0]);
    if (counterpart && internal.includes(counterpart)) p.switcher[other] = 'ok';
    else if (internal.includes(homeOf[other])) {
      p.switcher[other] = 'home-only';
      if (e.path !== homeOf[lang])
        add(
          'lang-switch-to-home',
          e.loc,
          `link to ${homeOf[other]} but not to counterpart ${counterpart}`,
        );
    } else {
      p.switcher[other] = 'absent';
    }
  }
  const absentAll = Object.values(p.switcher).every(v => v === 'absent');
  if (absentAll)
    add(
      'lang-switch-not-in-ssr',
      e.loc,
      `no SSR anchors to other-language versions${hasHreflangAnchors ? '' : ' (client-side switcher?)'}`,
    );
}

// ---------- noindex pages receiving many links ----------
for (const [path, n] of nodes) {
  if (n.status === 200 && n.noindex && n.in >= 5)
    add(
      'noindex-heavily-linked',
      path,
      `noindex page has ${n.in} inbound linking pages`,
    );
}

// ---------- outputs ----------
mkdirSync(OUT_DIR, { recursive: true });
const nodeList = [...nodes.values()].sort((a, b) =>
  a.path.localeCompare(b.path),
);
writeFileSync(
  join(OUT_DIR, 'graph.json'),
  JSON.stringify({ baseUrl: BASE_URL, nodes: nodeList, edges }, null, 1),
);

const byType = new Map();
for (const i of issues) {
  if (!byType.has(i.type)) byType.set(i.type, []);
  byType.get(i.type).push(i);
}
const okPages = nodeList.filter(n => n.status === 200);
const langRows = LOCALES.map(l => {
  const ns = okPages.filter(n => n.lang === l);
  const depths = ns.map(n => n.depth).filter(d => d !== undefined);
  return `| ${l} | ${ns.length} | ${ns.filter(n => n.inSitemap).length} | ${depths.length ? Math.max(...depths) : '-'} | ${ns.filter(n => n.noindex).length} |`;
});
const md = [];
md.push(
  `# Crawl report`,
  '',
  `BASE_URL: ${BASE_URL}  | sitemap host: ${siteHost}`,
  '',
);
md.push(
  `Pages fetched: ${pages.size} (200: ${okPages.length}); sitemap URLs: ${entries.length}; link occurrences: ${[...pages.values()].reduce((s, p) => s + p.links.length, 0)}; unique internal edges: ${edges.length}`,
  '',
);
md.push(
  '## Pages per language',
  '',
  '| lang | pages 200 | in sitemap | max depth | noindex |',
  '|---|---|---|---|---|',
  ...langRows,
  '',
);
md.push('## Issues summary', '', '| type | count |', '|---|---|');
for (const [t, l] of [...byType].sort((a, b) => b[1].length - a[1].length))
  md.push(`| ${t} | ${l.length} |`);
if (!issues.length) md.push('| (none) | 0 |');
md.push('', '## Issues (examples, up to 15 per type)', '');
for (const [t, l] of byType) {
  md.push(
    `### ${t} (${l.length})`,
    '',
    '| URL | detail | source |',
    '|---|---|---|',
  );
  const uniq = [];
  const seenK = new Set();
  for (const i of l) {
    const k = i.url + i.detail;
    if (seenK.has(k)) continue;
    seenK.add(k);
    uniq.push(i);
  }
  for (const i of uniq.slice(0, 15))
    md.push(
      `| ${i.url} | ${i.detail.replace(/\|/g, '\\|')} | ${i.source.replace(/\|/g, '\\|')} |`,
    );
  if (uniq.length > 15) md.push(`| ... | +${uniq.length - 15} more | |`);
  md.push('');
}
md.push(
  '## Click depth (from own-language home)',
  '',
  '| depth | pages |',
  '|---|---|',
);
const dh = new Map();
for (const n of okPages)
  if (n.inSitemap)
    dh.set(
      n.depth ?? 'unreachable',
      (dh.get(n.depth ?? 'unreachable') || 0) + 1,
    );
for (const [d, c] of [...dh].sort()) md.push(`| ${d} | ${c} |`);
md.push(
  '',
  'Pages deeper than 3 / unreachable: see issues deep-page / unreachable-from-home.',
  '',
);
md.push('## Orphans', '');
const orph = issues.filter(i => i.type === 'orphan');
md.push(orph.length ? orph.map(i => `- ${i.url}`).join('\n') : 'none', '');
md.push(
  '## Top 20 by inbound (unique linking pages)',
  '',
  '| URL | in | out |',
  '|---|---|---|',
);
for (const n of [...okPages].sort((a, b) => b.in - a.in).slice(0, 20))
  md.push(`| ${n.path} | ${n.in} | ${n.out} |`);
md.push('', '## Top 20 by outbound', '', '| URL | in | out |', '|---|---|---|');
for (const n of [...okPages].sort((a, b) => b.out - a.out).slice(0, 20))
  md.push(`| ${n.path} | ${n.in} | ${n.out} |`);
md.push(
  '',
  '## Lowest 20 inbound (sitemap pages)',
  '',
  '| URL | in | out |',
  '|---|---|---|',
);
for (const n of okPages
  .filter(n => n.inSitemap)
  .sort((a, b) => a.in - b.in)
  .slice(0, 20))
  md.push(`| ${n.path} | ${n.in} | ${n.out} |`);
writeFileSync(join(OUT_DIR, 'crawl-report.md'), md.join('\n'));

console.log(
  `Pages: ${pages.size}, sitemap: ${entries.length}, edges: ${edges.length}, issues: ${issues.length}`,
);
for (const [t, l] of byType) console.log(`  ${t}: ${l.length}`);
console.log(`Report: ${join(OUT_DIR, 'crawl-report.md')}`);
