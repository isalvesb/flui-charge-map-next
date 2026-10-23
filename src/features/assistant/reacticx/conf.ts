// Reacticx Energy Orb — Copyright (c) 2026 rit3zh, MIT.
// Fonte fixada em 4e11fcfe04e0bd7054574acc1557320911d70e4c. Licença integral em ./LICENSE.
import type { RGB } from "./types";

const SHADER_SOURCE = /*wgsl*/ `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform float uSpeed;
  uniform float uIntensity;
  uniform vec3 uColor0;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uGlowRadius;
  uniform float uMapMode;
  uniform float uMapPulse;

  // UX-MAPA-01: esfera de vidro com três fitas de luz, inspirada na referência
  // visual fornecida pelo usuário. Tudo é procedural, sem vídeo ou textura.
  vec4 mapOrb(vec2 uv) {
    vec2 p = uv / 0.46;
    float radius = length(p);
    float feather = 1.0 - smoothstep(0.72, 1.05, radius);
    float z = sqrt(max(0.0, 1.0 - dot(p, p)));
    float t = iTime * 1.15;
    float envelope = pow(max(0.0, 1.0 - p.x * p.x), 0.65);
    float breath = 0.72 + 0.22 * sin(t * 0.85);
    vec3 light = vec3(0.0);
    float energy = 0.0;

    // Fitas largas com bordas finas: cruzam-se e mudam de volume suavemente.
    for (int i = 0; i < 3; i++) {
      float phase = float(i) * 2.094395;
      float center = sin(p.x * 4.2 + t + phase) * 0.52 * envelope * breath;
      float width = (0.065 + 0.22 * (0.5 + 0.5 * sin(p.x * 3.0 - t * 0.8 + phase))) * envelope;
      float d = abs(p.y - center);
      float ribbon = exp(-pow(d / max(0.025, width), 2.0) * 1.6);
      float edge = exp(-pow((d - width * 0.8) / 0.018, 2.0));
      float core = exp(-pow(d / 0.025, 2.0));
      float glow = exp(-pow(d / max(0.055, width * 1.9), 2.0) * 1.5);
      vec3 hue = mix(uColor2, uColor1, 0.5 + 0.5 * sin(phase + p.x * 1.7 - t * 0.3));
      hue = mix(hue, vec3(0.78, 0.42, 1.0), float(i) * 0.16);
      light += mix(hue, vec3(0.94, 0.82, 1.0), ribbon * 0.4) * (ribbon * 0.72 + edge * 0.28 + glow * 0.11)
        + mix(uColor1, vec3(1.0), 0.65) * core * 0.16;
      energy += ribbon * 0.65 + edge * 0.24 + glow * 0.12;
    }

    // Interior alterna suavemente entre dois violetas, com contorno macio e reflexos.
    float rim = exp(-pow((radius - 0.96) / 0.025, 2.0));
    float angle = atan(p.y, p.x);
    float glint = pow(0.5 + 0.5 * cos(angle * 3.0 + t * 0.45), 12.0);
    float highlight = exp(-dot(p - vec2(-0.30, -0.68), p - vec2(-0.30, -0.68)) / 0.007);
    float glass = (0.94 + z * 0.03) * (1.0 - smoothstep(0.9, 1.03, radius));
    float opacity = mix(0.8, 0.6, uMapPulse);
    float waveAlpha = clamp(energy * 0.72 + rim * (0.23 + glint * 0.45) + highlight * 0.4, 0.0, 1.0) * opacity;
    vec3 hue = light * 0.72 + uColor1 * rim * (0.23 + glint * 0.45)
      + vec3(0.95, 0.88, 1.0) * highlight * 0.4;
    vec3 waveColor = clamp(hue * opacity, vec3(0.0), vec3(waveAlpha));
    float alpha = (waveAlpha + glass * (1.0 - waveAlpha)) * feather;
    vec3 glassColor = mix(uColor0, uColor1, mix(0.22, 0.34, uMapPulse));
    vec3 color = (waveColor + glassColor * glass * (1.0 - waveAlpha)) * feather;
    return vec4(clamp(color, vec3(0.0), vec3(alpha)), alpha);
  }

  vec4 main(vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;
    float r = length(uv);

    if (uMapMode > 0.5) {
      return mapOrb(uv);
    }

    // Flui: mantém um nível mínimo de brilho, evitando desaparecer no repouso.
    float wave = sin(r * 2.0 - iTime * uSpeed) * 0.35 + 0.65;
    float glow = smoothstep(uGlowRadius, 0.2, r) * wave * uIntensity;

    float t1 = sin(iTime * 0.8 + r * 6.0) * 0.5 + 0.5;
    float t2 = sin(iTime * 0.5 + r * 3.0) * 0.5 + 0.5;

    vec3 color = mix(mix(uColor0, uColor1, t1), uColor2, t2) * glow;

    color += 0.26 * smoothstep(0.55, 0.3, r) * mix(uColor0, uColor2, 0.5);

    float alpha = clamp(smoothstep(0.6, 0.2, r) * glow, 0.0, 1.0);

    // Flui: canais associados ao alpha dentro dos limites esperados pelo Skia.
    return vec4(clamp(color, vec3(0.0), vec3(alpha)), alpha);
  }
`;

const NAMED_COLORS: Record<string, RGB> = {
  red: [1, 0, 0],
  green: [0, 1, 0],
  blue: [0, 0, 1],
  white: [1, 1, 1],
  black: [0, 0, 0],
  yellow: [1, 1, 0],
  cyan: [0, 1, 1],
  magenta: [1, 0, 1],
  orange: [1, 0.65, 0],
  purple: [0.5, 0, 0.5],
  pink: [1, 0.75, 0.8],
};

const DEFAULT_COLORS = ["#4D80FF", "#FF4D80", "#80FF4D"];
const DEFAULT_SPEED = 1.0;
const DEFAULT_INTENSITY = 2.0;
const DEFAULT_GLOW_RADIUS = 0.45;
const DEFAULT_SIZE = 400;

export {
  SHADER_SOURCE,
  NAMED_COLORS,
  DEFAULT_COLORS,
  DEFAULT_SPEED,
  DEFAULT_INTENSITY,
  DEFAULT_GLOW_RADIUS,
  DEFAULT_SIZE,
};
