'use client';

import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { createPortal } from 'react-dom';

// WebGL "lens" carousel (adapted from 21st.dev / kedhareswer 3d-curved-carousel).
// Cards sit on one canvas: the centre one is flat, the outer ones grow taller and
// bend (concave look). Added: per-card hover, click → card pops out and enlarges,
// portrait project screenshots, real links for crawlers (sr-only list).

export type LensSlide = {
  title: string;
  kicker?: string;
  caption?: string;
  image: string;
  alt?: string;
  href?: string;
};

export type CurvedLensCarouselProps = {
  slides: LensSlide[];
  label?: React.ReactNode;
  hint?: string;
  prevLabel?: string;
  nextLabel?: string;
  closeLabel?: string;
  openLabel?: (title: string) => string;
  bend?: number;
  background?: string;
  ink?: string;
  height?: string;
  /** Card height / width. Phone screenshots: 984/600. */
  ratio?: number;
  footer?: React.ReactNode;
  className?: string;
};

const wrap = (i: number, n: number) => (n > 0 ? ((i % n) + n) % n : 0);
const offsetOf = (i: number, pos: number, n: number) =>
  n <= 0 ? 0 : wrap(i - pos + n / 2, n) - n / 2;
const restFor = (pos: number, velocity: number, max = 3) =>
  Math.round(pos + Math.max(-max, Math.min(max, velocity * 0.18)));
const springStep = (
  pos: number,
  vel: number,
  target: number,
  dt: number,
  omega = 11,
): [number, number] => {
  const a = (target - pos) * omega * omega - vel * 2 * omega;
  const v = vel + a * dt;
  return [pos + v * dt, v];
};
const cardSize = (w: number, h: number, ratio: number): [number, number] => {
  const cw = Math.min(
    w < 640 ? w * 0.7 : w < 1024 ? w * 0.2 : w * 0.15,
    (h * (w < 640 ? 0.68 : 0.56)) / ratio,
  );
  return [Math.round(cw), Math.round(cw * ratio)];
};
const pad2 = (n: number) => (n < 10 ? '0' + n : String(n));

const VERT =
  'attribute vec2 aPos;' +
  'uniform vec2 uRes;uniform vec2 uSize;uniform float uX;uniform float uBend;uniform float uVel;uniform float uIntro;uniform float uLift;uniform float uHover;' +
  'varying vec2 vUv;varying float vX;' +
  'void main(){' +
  'vec2 p=vec2(uX+(aPos.x-.5)*uSize.x,(aPos.y-.5)*uSize.y);' +
  'p*=1.+.045*uHover;p.y+=uHover*uSize.y*.025;' +
  'p.y-=(1.-uIntro)*uSize.y*.9;' +
  'vec2 n=p/(uRes*.5);' +
  'float x=clamp(n.x,-1.4,1.4);' +
  'n.y*=1.+uBend*x*x;' +
  'n.y+=uVel*.05*sin(aPos.x*3.14159)*(aPos.y-.5);' +
  'n.x*=1.-.06*uBend*x*x;n.y+=uLift;' +
  'vUv=aPos;vX=x;' +
  'gl_Position=vec4(n,0.,1.);}';

const FRAG =
  'precision highp float;' +
  'uniform sampler2D uTex;uniform vec2 uSize;uniform float uAspect;uniform float uVel;uniform float uIntro;uniform float uShift;uniform float uReady;uniform float uHover;' +
  'varying vec2 vUv;varying float vX;' +
  'float box(vec2 q,vec2 b,float r){vec2 d=abs(q)-b+r;return length(max(d,0.))+min(max(d.x,d.y),0.)-r;}' +
  'void main(){' +
  'float a=uSize.x/uSize.y;vec2 uv=vUv-.5;' +
  'if(uAspect>a)uv.x*=a/uAspect;else uv.y*=uAspect/a;' +
  'uv=uv/1.0+.5;uv.x+=uShift;' +
  'float ca=(.0012+.0045*vX*vX)*(1.+abs(uVel)*1.2);' +
  'vec3 c=vec3(texture2D(uTex,uv+vec2(ca,0.)).r,texture2D(uTex,uv).g,texture2D(uTex,uv-vec2(ca,0.)).b);' +
  'c=mix(vec3(.11,.11,.12),c,uReady);' +
  'c*=1.-.42*min(1.,vX*vX)*(1.-.7*uHover);' +
  'c*=1.+.1*uHover;' +
  'float d=box((vUv-.5)*uSize,uSize*.5,6.);' +
  'float rim=smoothstep(-5.,0.,d);' +
  'c+=rim*(.10+.25*uHover);' +
  'float al=smoothstep(.75,-.75,d)*uIntro;' +
  'gl_FragColor=vec4(c*al,al);}';

const CSS =
  '.clc-root{position:relative;width:100%;overflow:hidden;isolation:isolate;outline:none;user-select:none;-webkit-user-select:none}' +
  '.clc-root:focus-visible{box-shadow:inset 0 0 0 2px var(--clc-ink)}' +
  '.clc-stage{position:relative;width:100%;height:calc(var(--clc-h) - 56px)}' +
  '@media (max-width:640px){.clc-stage{height:calc(clamp(560px,165vw,780px) - 36px)}}' +
  '.clc-glow{position:absolute;inset:-20%;background:radial-gradient(50% 40% at 50% 46%,rgba(255,240,220,.07),transparent 70%);pointer-events:none}' +
  ".clc-grain{position:absolute;inset:0;opacity:.07;mix-blend-mode:overlay;pointer-events:none;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")}" +
  '.clc-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;cursor:grab;touch-action:pan-y}' +
  '.clc-canvas:active{cursor:grabbing}' +
  '.clc-top{position:absolute;left:clamp(16px,3vw,40px);right:clamp(16px,3vw,40px);top:16px;display:flex;justify-content:space-between;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--clc-ink);opacity:.55;pointer-events:none}' +
  '.clc-foot{position:relative;display:flex;align-items:flex-end;justify-content:space-between;gap:20px;padding:8px clamp(16px,3vw,40px) 28px;color:var(--clc-ink)}' +
  '.clc-copy{min-width:0;flex:1}' +
  '.clc-kicker{display:block;font-size:11px;letter-spacing:.22em;text-transform:uppercase;opacity:.55;margin-bottom:8px}' +
  '.clc-title{font-weight:600;font-size:clamp(24px,3.6vw,48px);line-height:1;letter-spacing:-.03em;margin:0;display:block}' +
  '.clc-ch{display:inline-block;transform:translateY(105%);opacity:0;transition:transform .7s cubic-bezier(.2,.9,.1,1),opacity .5s ease}' +
  '.clc-line{display:block;overflow:hidden;padding-bottom:.08em}' +
  '.clc-in .clc-ch{transform:none;opacity:1}' +
  '.clc-ctl{display:flex;flex-direction:column;align-items:flex-end;gap:12px}' +
  '.clc-count{font-size:12px;letter-spacing:.18em;font-variant-numeric:tabular-nums;opacity:.8}' +
  '.clc-count i{font-style:normal;opacity:.45}' +
  '.clc-bar{width:132px;height:2px;background:color-mix(in srgb,var(--clc-ink) 16%,transparent);overflow:hidden}' +
  '.clc-bar>span{display:block;height:100%;width:100%;background:var(--clc-ink);transform-origin:0 50%;transition:transform .7s cubic-bezier(.2,.9,.1,1)}' +
  '.clc-btns{display:flex;gap:10px}' +
  '.clc-btn{width:46px;height:46px;border-radius:999px;display:grid;place-items:center;color:var(--clc-ink);cursor:pointer;background:linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.14);transition:transform .35s cubic-bezier(.3,1.6,.5,1),background .3s ease}' +
  '.clc-btn:hover{transform:translateY(-2px) scale(1.06);background:rgba(255,255,255,.2)}' +
  '.clc-btn:active{transform:scale(.94)}' +
  '.clc-btn:focus-visible{outline:2px solid var(--clc-ink);outline-offset:3px}' +
  '.clc-btn svg{width:18px;height:18px}' +
  '.clc-side{position:absolute;top:50%;width:56px;height:56px;margin-top:-28px;z-index:3;border-radius:999px;border:0;overflow:hidden;background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.02) 55%,rgba(255,255,255,.1) 100%);box-shadow:inset 0 1.5px 1px rgba(255,255,255,.55),inset 0 -1.5px 1px rgba(255,255,255,.18),inset 0 0 0 1px rgba(255,255,255,.08),0 8px 24px -8px rgba(0,0,0,.5);transition:transform .35s cubic-bezier(.3,1.6,.5,1),box-shadow .3s ease}' +
  '.clc-side::before{content:"";position:absolute;left:14%;top:6%;width:72%;height:38%;border-radius:50%;pointer-events:none;background:linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,0))}' +
  '.clc-side svg{position:relative;width:22px;height:22px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5))}' +
  '.clc-side:hover{transform:scale(1.1);box-shadow:inset 0 1.5px 1px rgba(255,255,255,.8),inset 0 -1.5px 1px rgba(255,255,255,.3),inset 0 0 0 1px rgba(255,255,255,.16),0 10px 28px -8px rgba(0,0,0,.6)}' +
  '.clc-side-l{left:clamp(10px,2.5vw,32px)}' +
  '.clc-side-r{right:clamp(10px,2.5vw,32px)}' +
  '.clc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
  '@media (max-width:640px){.clc-foot{flex-direction:column;align-items:stretch}.clc-ctl{flex-direction:row;align-items:center;justify-content:space-between}}' +
  '@media (prefers-reduced-motion:reduce){.clc-ch,.clc-bar>span,.clc-btn{transition:opacity .2s ease}.clc-ch{transform:none}}';

type Rect = { left: number; top: number; width: number; height: number };
type Zoom = { index: number; rect: Rect };

function shader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type) as WebGLShader;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function grid(segX: number, segY: number): Float32Array {
  const out: number[] = [];
  for (let y = 0; y < segY; y++)
    for (let x = 0; x < segX; x++) {
      const x0 = x / segX,
        x1 = (x + 1) / segX,
        y0 = y / segY,
        y1 = (y + 1) / segY;
      out.push(x0, y0, x1, y0, x0, y1, x0, y1, x1, y0, x1, y1);
    }
  return new Float32Array(out);
}

function Chars({ text, base }: { text: string; base: number }) {
  return (
    <>
      {text.split(' ').map((word, w, all) => (
        <React.Fragment key={w}>
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {word.split('').map((ch, i) => (
              <span
                key={i}
                className="clc-ch"
                style={{
                  transitionDelay:
                    base + (all.slice(0, w).join(' ').length + i) * 20 + 'ms',
                }}
              >
                {ch}
              </span>
            ))}
          </span>
          {w < all.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </>
  );
}

function Copy({ slide, shown }: { slide: LensSlide; shown: boolean }) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    if (!shown) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setOn(true)),
    );
    return () => cancelAnimationFrame(id);
  }, [shown]);
  return (
    <div className={'clc-copy' + (on ? ' clc-in' : '')} aria-live="polite">
      {slide.kicker ? <span className="clc-kicker">{slide.kicker}</span> : null}
      <h3 className="clc-title">
        <span className="clc-line">
          <Chars text={slide.title} base={40} />
        </span>
      </h3>
    </div>
  );
}

export default function CurvedLensCarousel({
  slides,
  label,
  hint,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  closeLabel = 'Close',
  openLabel = t => t,
  bend = 0.55,
  background = '#111111',
  ink = '#f3ede4',
  height = 'clamp(520px, 48vw, 700px)',
  ratio = 984 / 600,
  footer,
  className,
}: CurvedLensCarouselProps) {
  const n = slides.length;
  const rootRef = React.useRef(null as HTMLDivElement | null);
  const canvasRef = React.useRef(null as HTMLCanvasElement | null);
  const [index, setIndex] = React.useState(0);
  const [shown, setShown] = React.useState(false);
  const [noGL, setNoGL] = React.useState(false);
  const [zoom, setZoom] = React.useState(null as Zoom | null);
  const [vp, setVp] = React.useState({ w: 1200, h: 800 });
  const [mounted, setMounted] = React.useState(false);
  const api = React.useRef({
    go: (_d: number) => {},
    pause: (_p: boolean) => {},
  });
  const selectRef = React.useRef((_i: number, _r: Rect) => {});
  selectRef.current = (i, r) => setZoom({ index: i, rect: r });

  React.useEffect(() => {
    setMounted(true);
    const upd = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);

  React.useEffect(() => {
    api.current.pause(!!zoom);
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setZoom(null);
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [zoom]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root || n === 0) return;
    const gl = canvas.getContext('webgl', {
      premultipliedAlpha: true,
      antialias: true,
      alpha: true,
    });
    if (!gl) {
      setNoGL(true);
      setShown(true);
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prog = gl.createProgram() as WebGLProgram;
    gl.attachShader(prog, shader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('CurvedLensCarousel: ' + gl.getProgramInfoLog(prog));
      setNoGL(true);
      setShown(true);
      return;
    }
    gl.useProgram(prog);
    const mesh = grid(36, 12);
    const buf = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u: Record<string, WebGLUniformLocation | null> = {};
    for (const k of [
      'uRes',
      'uSize',
      'uX',
      'uBend',
      'uVel',
      'uIntro',
      'uTex',
      'uAspect',
      'uShift',
      'uReady',
      'uLift',
      'uHover',
    ])
      u[k] = gl.getUniformLocation(prog, k);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let disposed = false;
    const tex = slides.map(s => {
      const t = gl.createTexture() as WebGLTexture;
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([28, 28, 30, 255]),
      );
      for (const [p, v] of [
        [gl.TEXTURE_MIN_FILTER, gl.LINEAR],
        [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
        [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
        [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
      ])
        gl.texParameteri(gl.TEXTURE_2D, p, v);
      const entry = { t, aspect: 0.6, ready: false, load: () => {} };
      const img = new Image();
      if (!s.image.startsWith('data:')) img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.onload = () => {
        if (disposed) return;
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          img,
        );
        entry.aspect = img.naturalWidth / img.naturalHeight;
        entry.ready = true;
        kick();
      };
      let started = false;
      entry.load = () => {
        if (started) return;
        started = true;
        img.src = s.image;
      };
      return entry;
    });

    // Load nearest-to-centre slides first; the rest a moment later, and nothing
    // at all until the carousel is close to the viewport.
    let loadStarted = false;
    const startLoad = () => {
      if (loadStarted) return;
      loadStarted = true;
      const order = Array.from({ length: n }, (_, i) => i).sort(
        (a, b) => Math.abs(offsetOf(a, 0, n)) - Math.abs(offsetOf(b, 0, n)),
      );
      order.slice(0, 7).forEach(i => tex[i].load());
      window.setTimeout(() => order.slice(7).forEach(i => tex[i].load()), 500);
    };
    const ioLoad = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          startLoad();
          ioLoad.disconnect();
        }
      },
      { rootMargin: '700px 0px' },
    );
    ioLoad.observe(root);

    let W = 1,
      H = 1,
      cw = 1,
      ch = 1,
      gap = 1;
    let pos = 0,
      vel = 0,
      target = 0;
    let intro = reduced.matches ? 1 : 0;
    let introStart = -1;
    let dragging = false,
      dragX = 0,
      dragPos = 0,
      lastX = 0,
      lastT = 0,
      flick = 0,
      moved = 0;
    let raf = 0,
      last = 0,
      visible = true,
      current = 0,
      paused = false,
      over = false;
    let hoverIdx = -1;
    const hov = new Array(n).fill(0) as number[];
    let auto = 0;

    // Black space is trimmed at the bottom only: cards are sized as if the stage were
    // `trim` px taller, and the stage itself is that much shorter.
    const bendNow = () => (W < 640 ? bend * 0.5 : bend);
    const trim = () => (W < 640 ? 36 : 56);
    const lift = () => {
      const l0 = W < 640 ? 0 : -0.02;
      const cyPx = ((H + trim()) / 2) * (1 - l0);
      return -(cyPx - H / 2) / (H / 2);
    };

    const resize = (w: number, h: number) => {
      W = Math.max(1, w);
      H = Math.max(1, h);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      [cw, ch] = cardSize(W, H + trim(), ratio);
      gap = cw * (W < 1024 ? 0.14 : 0.1);
      gl.viewport(0, 0, canvas.width, canvas.height);
      kick();
    };

    /** Screen rect (canvas-local px) of slide i with the lens distortion applied. */
    const rectOf = (i: number): Rect => {
      const d = offsetOf(i, pos, n);
      const x = d * (cw + gap);
      const xn = Math.max(-1.4, Math.min(1.4, x / (W / 2)));
      const sy = 1 + bendNow() * xn * xn;
      const sx = 1 - 0.06 * bendNow() * xn * xn;
      const w = cw * sx * (1 + 0.045 * hov[i]);
      const h = ch * sy * (1 + 0.045 * hov[i]);
      const cx = W / 2 + x * sx;
      const cy = (H / 2) * (1 - lift());
      return { left: cx - w / 2, top: cy - h / 2, width: w, height: h };
    };

    const hit = (px: number, py: number) => {
      let best = -1,
        bestD = 1e9;
      for (let i = 0; i < n; i++) {
        const r = rectOf(i);
        if (
          px >= r.left &&
          px <= r.left + r.width &&
          py >= r.top &&
          py <= r.top + r.height
        ) {
          const dd = Math.abs(offsetOf(i, pos, n));
          if (dd < bestD) {
            bestD = dd;
            best = i;
          }
        }
      }
      return best;
    };

    const draw = () => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(u.uRes, W, H);
      gl.uniform2f(u.uSize, cw, ch);
      gl.uniform1f(u.uBend, bendNow());
      gl.uniform1f(
        u.uVel,
        reduced.matches ? 0 : Math.max(-1, Math.min(1, vel * 0.12)),
      );
      gl.uniform1f(u.uLift, lift());
      const step = cw + gap;
      // draw far cards first so the hovered / centre card sits on top
      const order = Array.from({ length: n }, (_, i) => i).sort(
        (a, b) => Math.abs(offsetOf(b, pos, n)) - Math.abs(offsetOf(a, pos, n)),
      );
      for (const i of order) {
        const d = offsetOf(i, pos, n);
        const x = d * step;
        if (Math.abs(x) > W * 0.5 + step * 1.5) continue;
        const o = Math.abs(d);
        const t = Math.max(0, Math.min(1, (intro - o * 0.12) / 0.6));
        const e = 1 - Math.pow(1 - t, 3);
        gl.bindTexture(gl.TEXTURE_2D, tex[i].t);
        gl.uniform1f(u.uX, x);
        gl.uniform1f(u.uIntro, e);
        gl.uniform1f(u.uAspect, tex[i].aspect);
        gl.uniform1f(u.uReady, tex[i].ready ? 1 : 0);
        gl.uniform1f(u.uHover, hov[i]);
        gl.uniform1f(u.uShift, Math.max(-0.05, Math.min(0.05, -d * 0.035)));
        gl.drawArrays(gl.TRIANGLES, 0, mesh.length / 2);
      }
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      if (intro < 1) {
        if (introStart < 0) introStart = now;
        intro = Math.min(1.5, (now - introStart) / 1100);
        if (intro >= 1.5) intro = 1;
      }
      // slow continuous drift while visible, not hovered, not zoomed
      if (
        !reduced.matches &&
        visible &&
        !over &&
        !paused &&
        !dragging &&
        intro >= 1
      ) {
        if (W < 640) {
          // phones: the card is nearly full width, so rest centred and glide one at a time
          auto += dt;
          if (auto > 3.2) {
            auto = 0;
            target = Math.round(target) + 1;
          }
        } else {
          target += dt * 0.12;
        }
      }
      if (!dragging) {
        if (reduced.matches) {
          pos = target;
          vel = 0;
        } else [pos, vel] = springStep(pos, vel, target, dt);
      }
      let hovering = false;
      for (let i = 0; i < n; i++) {
        const goal = i === hoverIdx && !dragging ? 1 : 0;
        const nv = reduced.matches
          ? goal
          : hov[i] + (goal - hov[i]) * Math.min(1, dt * 12);
        hov[i] = Math.abs(nv - goal) < 0.002 ? goal : nv;
        if (hov[i] !== goal) hovering = true;
      }
      const idx = wrap(Math.round(pos), n);
      if (idx !== current) {
        current = idx;
        setIndex(idx);
      }
      draw();
      const settled =
        !dragging &&
        !hovering &&
        Math.abs(target - pos) < 0.0005 &&
        Math.abs(vel) < 0.001 &&
        (intro >= 1 || reduced.matches);
      if (settled) {
        pos = target;
        draw();
        last = 0;
      }
      // keep ticking while autoplay may fire
      if (visible && (!settled || (!reduced.matches && !over && !paused)))
        raf = requestAnimationFrame(frame);
    };

    function kick() {
      if (!raf && visible && !disposed) raf = requestAnimationFrame(frame);
    }

    api.current.go = (dir: number) => {
      target = Math.round(target) + dir;
      auto = 0;
      kick();
    };
    api.current.pause = (p: boolean) => {
      paused = p;
      kick();
    };

    const local = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      return { x: e.clientX - b.left, y: e.clientY - b.top, b };
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true;
      moved = 0;
      dragX = lastX = e.clientX;
      lastT = e.timeStamp;
      dragPos = pos;
      flick = 0;
      canvas.setPointerCapture(e.pointerId);
      kick();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) {
        const { x, y } = local(e);
        const h = hit(x, y);
        if (h !== hoverIdx) {
          hoverIdx = h;
          canvas.style.cursor = h >= 0 ? 'zoom-in' : 'grab';
          kick();
        }
        return;
      }
      moved = Math.max(moved, Math.abs(e.clientX - dragX));
      const step = cw + gap;
      const p = dragPos - (e.clientX - dragX) / step;
      const dts = Math.max(1, e.timeStamp - lastT) / 1000;
      flick = flick * 0.6 + (-(e.clientX - lastX) / step / dts) * 0.4;
      vel = flick;
      lastX = e.clientX;
      lastT = e.timeStamp;
      pos = p;
      auto = 0;
      kick();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (moved < 6 && e.type === 'pointerup') {
        const { x, y, b } = local(e);
        const h = hit(x, y);
        if (h >= 0) {
          const r = rectOf(h);
          selectRef.current(h, {
            left: b.left + r.left,
            top: b.top + r.top,
            width: r.width,
            height: r.height,
          });
          target = Math.round(pos);
          kick();
          return;
        }
      }
      target = restFor(pos, flick);
      vel = flick;
      kick();
    };
    let wheelTimer = 0;
    const onWheel = (e: WheelEvent) => {
      // trackpad / shift+wheel: horizontal gesture scrolls the carousel, vertical scrolls the page
      const dx =
        Math.abs(e.deltaX) > Math.abs(e.deltaY)
          ? e.deltaX
          : e.shiftKey
            ? e.deltaY
            : 0;
      if (!dx) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : 1;
      pos += (dx * unit) / (cw + gap) / 1.3;
      target = pos;
      vel = 0;
      auto = 0;
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        target = Math.round(pos);
        kick();
      }, 130);
      kick();
    };
    const onLeave = () => {
      hoverIdx = -1;
      over = false;
      kick();
    };
    const onEnter = () => {
      over = true;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') api.current.go(1);
      else if (e.key === 'ArrowLeft') api.current.go(-1);
      else return;
      e.preventDefault();
    };
    const onMotion = () => kick();

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('pointerenter', onEnter);
    root.addEventListener('keydown', onKey);
    reduced.addEventListener('change', onMotion);

    const ro = new ResizeObserver(entries => {
      const r = entries[0].contentRect;
      resize(r.width, r.height);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) {
        setShown(true);
        kick();
      }
    });
    io.observe(root);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      ioLoad.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('wheel', onWheel);
      window.clearTimeout(wheelTimer);
      canvas.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('keydown', onKey);
      reduced.removeEventListener('change', onMotion);
      for (const t of tex) gl.deleteTexture(t.t);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [n, slides, bend, ratio]);

  const slide = slides[index] ?? slides[0];
  if (!slide) return null;

  const zp = zoom ? slides[zoom.index] : undefined;
  const zh = Math.min(vp.h - 150, (vp.w - 32) / (600 / 984), 900);
  const zw = zh * (600 / 984);
  const target = {
    left: (vp.w - zw) / 2,
    top: Math.max(16, (vp.h - zh - 64) / 2),
    width: zw,
    height: zh,
  };

  const vars = { background, '--clc-ink': ink } as React.CSSProperties;

  return (
    <div
      ref={rootRef}
      className={'clc-root' + (className ? ' ' + className : '')}
      style={vars}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={typeof label === 'string' ? label : 'Carousel'}
    >
      <style>{CSS}</style>
      <div
        className="clc-stage"
        style={{ '--clc-h': height } as React.CSSProperties}
      >
        <div className="clc-glow" aria-hidden="true" />
        <canvas ref={canvasRef} className="clc-canvas" aria-hidden="true" />
        {noGL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slide.image}
            alt={slide.alt ?? slide.title}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              height: '60%',
              transform: 'translate(-50%,-50%)',
            }}
          />
        ) : null}
        <div className="clc-grain" aria-hidden="true" />
        <button
          type="button"
          className="clc-btn clc-side clc-side-l"
          aria-label={prevLabel}
          onClick={() => api.current.go(-1)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          className="clc-btn clc-side clc-side-r"
          aria-label={nextLabel}
          onClick={() => api.current.go(1)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="clc-top">
          <b style={{ fontWeight: 500 }}>{label}</b>
          <span>{hint}</span>
        </div>
      </div>

      <div className="clc-foot">
        <Copy key={index} slide={slide} shown={shown} />
        <div className="clc-ctl">
          <span className="clc-count">
            {pad2(index + 1)} <i>/ {pad2(n)}</i>
          </span>
          <span className="clc-bar" aria-hidden="true">
            <span style={{ transform: 'scaleX(' + (index + 1) / n + ')' }} />
          </span>
          <div className="clc-btns">
            <button
              type="button"
              className="clc-btn"
              aria-label={prevLabel}
              onClick={() => api.current.go(-1)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              className="clc-btn"
              aria-label={nextLabel}
              onClick={() => api.current.go(1)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {footer}

      {/* crawlers + keyboard users: real links to every project */}
      <ul className="clc-sr">
        {slides.map(s => (
          <li key={s.title}>
            {s.href ? (
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                {openLabel(s.title)}
              </a>
            ) : (
              s.title
            )}
          </li>
        ))}
      </ul>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {zoom && zp && (
              <motion.div
                key="zoom"
                className="fixed inset-0 z-[300]"
                initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
                animate={{ backgroundColor: 'rgba(0,0,0,0.88)' }}
                exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
                transition={{ duration: 0.3 }}
                onClick={() => setZoom(null)}
                role="dialog"
                aria-modal="true"
                aria-label={zp.title}
              >
                <motion.img
                  src={zp.image}
                  alt={zp.alt ?? zp.title}
                  draggable={false}
                  className="absolute object-cover object-top shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
                  initial={zoom.rect}
                  animate={target}
                  exit={zoom.rect}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  onClick={e => e.stopPropagation()}
                />
                <motion.div
                  className="absolute left-0 right-0 flex items-center justify-center gap-3 px-4 font-montserrat text-white"
                  style={{ top: target.top + target.height + 14 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  onClick={e => e.stopPropagation()}
                >
                  <span className="truncate text-[14px] md:text-[16px]">
                    {zp.title}
                  </span>
                  {zp.href && (
                    <a
                      href={zp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 bg-white px-4 py-2 text-[13px] font-medium text-[#111] transition-colors hover:bg-[#FF3830]"
                    >
                      {zp.href.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
                    </a>
                  )}
                </motion.div>
                <button
                  type="button"
                  aria-label={closeLabel}
                  onClick={() => setZoom(null)}
                  className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center border border-white/40 text-[22px] text-white transition-colors hover:bg-white hover:text-[#111]"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
