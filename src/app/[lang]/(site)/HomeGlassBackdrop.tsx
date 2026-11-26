'use client';

import { useEffect, useRef } from 'react';

// Clear iridescent glass arcs on white, drawn by a small fragment shader.
// Soft translucent bodies, thin-film rims in cyan / blue / deep blue, slow
// drift. Falls back to nothing without WebGL; one still frame when the
// visitor prefers reduced motion; paused while off screen.

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uR;
uniform float uT;

float band(float x, float c, float w){ float t=(x-c)/w; return exp(-t*t); }

void main(){
  vec2 uv = gl_FragCoord.xy / uR;
  vec2 p = (uv - 0.5) * vec2(uR.x / uR.y, 1.0) * 2.0;
  vec3 col = vec3(0.0);
  float a = 0.0;

  for (int i = 0; i < 2; i++) {
    float fi = float(i);
    vec2 c0 = i == 0 ? vec2(-0.25, -1.65) : (i == 1 ? vec2(1.0, -1.95) : vec2(-1.55, -0.85));
    float R = i == 0 ? 1.95 : (i == 1 ? 2.05 : 1.25);
    float w = i == 0 ? 0.52 : (i == 1 ? 0.36 : 0.30);
    vec2 c = c0 + 0.07 * vec2(sin(uT * 0.11 + fi * 1.7), cos(uT * 0.09 + fi * 2.3));
    vec2 q = p - c;
    float ang = atan(q.y, q.x);
    float r = length(q);
    r += 0.05 * sin(ang * 3.0 + uT * 0.17 + fi) + 0.022 * sin(ang * 7.0 - uT * 0.13 + fi * 2.0);
    float d = r - R;
    float ad = abs(d);
    float t = d / w;

    // glassy body: faint cool tint, a little denser toward the rims
    float inside = smoothstep(w * 1.04, w * 0.7, ad);
    float body = inside * (0.18 + 0.16 * t * t);
    col += vec3(0.80, 0.90, 1.0) * body;
    a += body;

    // thin-film rims: strongest on a few lobes around the arc
    float lobe = 0.10 + 0.90 * pow(0.5 + 0.5 * sin(ang * 1.7 + uT * 0.14 + fi * 2.4), 5.0);
    float rim = band(ad, w * 0.93, w * 0.07);
    float glow = band(ad, w * 0.93, w * 0.2);
    float ph = ad / w * 2.6 + ang * 0.9 + uT * 0.10 + fi;
    float m = 0.5 + 0.5 * sin(ph * 6.2831);
    vec3 cyan = vec3(0.42, 0.86, 1.0);
    vec3 blue = vec3(0.14, 0.34, 1.0);
    vec3 deep = vec3(0.03, 0.08, 0.55);
    vec3 irid = mix(mix(cyan, blue, m), deep, smoothstep(0.55, 1.0, 0.5 + 0.5 * sin(ph * 3.1 + 1.3)) * lobe);
    float ra = (rim * 0.6 + glow * 0.26) * lobe;
    col += irid * ra;
    a += ra;

    // soft secondary arcs inside the band, like the picture's inner folds
    float f1 = band(ad, w * 0.55, w * 0.10) * 0.16 * (0.4 + lobe);
    float f2 = 0.0;
    vec3 fc = mix(cyan, blue, 0.5 + 0.5 * sin(ang * 3.0 + uT * 0.12 + fi));
    col += fc * (f1 + f2);
    a += f1 + f2;

    // bright white line just inside the rim
    float wl = band(ad, w * 0.80, w * 0.03) * 0.55;
    col += vec3(1.0) * wl;
    a += wl;
  }

  a = clamp(a, 0.0, 1.0);
  col = min(col, vec3(a));
  gl_FragColor = vec4(col, a);
}
`;

export default function HomeGlassBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
      premultipliedAlpha: true,
      alpha: true,
      antialias: false,
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, 'uR');
    const uT = gl.getUniformLocation(prog, 'uT');

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let raf = 0;
    let visible = true;
    const t0 = performance.now();

    const size = () => {
      // the shader is all soft gradients, so a reduced resolution is enough
      const k = Math.min(window.devicePixelRatio || 1, 1.5) * 0.7;
      const w = Math.max(2, Math.round(canvas.clientWidth * k));
      const h = Math.max(2, Math.round(canvas.clientHeight * k));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    };
    const draw = (now: number) => {
      size();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, reduced ? 6 : (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const tick = (now: number) => {
      if (visible) draw(now);
      raf = requestAnimationFrame(tick);
    };
    if (reduced) {
      draw(t0);
    } else {
      raf = requestAnimationFrame(tick);
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    const onResize = () => draw(performance.now());
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
