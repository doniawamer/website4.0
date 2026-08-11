/**
 * Contrast helpers ported from the design mockup's live accent solver.
 * Given a background color and a "natural" accent hue, we binary-search
 * the accent's lightness (after a light desaturation) until it clears a
 * target WCAG contrast ratio against the background.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const int = parseInt(full, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = ((h % 360) + 360) % 360 / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (hp >= 0 && hp < 1) [r1, g1, b1] = [c, x, 0];
  else if (hp < 2) [r1, g1, b1] = [x, c, 0];
  else if (hp < 3) [r1, g1, b1] = [0, c, x];
  else if (hp < 4) [r1, g1, b1] = [0, x, c];
  else if (hp < 5) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  const m = ln - c / 2;
  return {
    r: (r1 + m) * 255,
    g: (g1 + m) * 255,
    b: (b1 + m) * 255,
  };
}

function channelLuminance(c: number): number {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(rgb: RGB): number {
  return (
    0.2126 * channelLuminance(rgb.r) +
    0.7152 * channelLuminance(rgb.g) +
    0.0722 * channelLuminance(rgb.b)
  );
}

export function contrastRatio(a: RGB, b: RGB): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Binary-searches the lightness channel of `accentHex` (after a slight
 * desaturation) so its contrast against `bgHex` clears `targetRatio`.
 * Moves toward black when the background is light, toward white when dark,
 * always trying to stay as close as possible to the original hue/chroma.
 */
export function solveAccent(
  bgHex: string,
  accentHex: string,
  targetRatio: number
): string {
  const bgRgb = hexToRgb(bgHex);
  const bgLum = relativeLuminance(bgRgb);
  const darken = bgLum > 0.5;
  const baseHsl = rgbToHsl(hexToRgb(accentHex));
  const hsl: HSL = { ...baseHsl, s: baseHsl.s * 0.92 };

  // Small safety margin so the final rounded-to-hex color still clears the
  // real target ratio after rgbToHex's integer rounding.
  const safeTarget = targetRatio * 1.01;

  let lo = darken ? 0 : hsl.l;
  let hi = darken ? hsl.l : 100;
  let resultL = darken ? 0 : 100;

  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    const candidate = hslToRgb({ ...hsl, l: mid });
    const ratio = contrastRatio(candidate, bgRgb);
    const passes = ratio >= safeTarget;
    if (darken) {
      if (passes) {
        resultL = mid;
        lo = mid;
      } else {
        hi = mid;
      }
    } else {
      if (passes) {
        resultL = mid;
        hi = mid;
      } else {
        lo = mid;
      }
    }
  }

  return rgbToHex(hslToRgb({ ...hsl, l: resultL }));
}
