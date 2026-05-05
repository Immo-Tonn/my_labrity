precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

float circle(vec2 uv, float r) {
    return smoothstep(r, r - 0.01, length(uv));
}

void main() {
    vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;

    float t = u_time * 0.2;

    float glow = 0.0;
    
    // Layer 1 (soft white)
    glow += circle(uv + vec2(sin(t) * 0.2, cos(t*1.3) * 0.2), 0.55) * 0.12;

    // Layer 2 (subtle movement)
    glow += circle(uv + vec2(cos(t*0.7) * 0.3, sin(t*1.2) * 0.25), 0.75) * 0.08;

    // Layer 3 (very faint wide glow)
    glow += circle(uv, 1.1) * 0.05;

    vec3 color = vec3(0.9, 0.9, 1.0) * glow;

    gl_FragColor = vec4(color, glow * 1.5);
}