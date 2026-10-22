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

  vec4 main(vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;
    float r = length(uv);

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
