import { solveAccent } from "./contrast";

/** Daylight palettes that the flower / theme-line cycle through. */
export type DayKey =
  | "first_light"
  | "midday"
  | "late_afternoon"
  | "golden_hour"
  | "dusk"
  | "blue_hour";

/** Active site theme — daylight keys, plus system dark (initial only). */
export type ThemeKey = DayKey | "dark_mode";

export interface Palette {
  bg: string;
  ink: string;
  accent: string;
  label: string;
}

/**
 * Inclusive [start, end) local-hour ranges. Anything outside these
 * windows (21:00–04:00) resolves to blue_hour.
 */
export const DAY_RANGES: readonly { key: DayKey; start: number; end: number }[] = [
  { key: "first_light", start: 4, end: 8 },
  { key: "midday", start: 8, end: 14 },
  { key: "late_afternoon", start: 14, end: 17 },
  { key: "golden_hour", start: 17, end: 19 },
  { key: "dusk", start: 19, end: 21 },
] as const;

export const DAY_KEYS: DayKey[] = DAY_RANGES.map((r) => r.key).concat("blue_hour");

export const PALETTES: Record<ThemeKey, Palette> = {
  first_light: {
    bg: "#F6F4F7",
    ink: "#2B2730",
    accent: "#8C7FA8",
    label: "pressed at first light",
  },
  midday: {
    bg: "#FBF6F0",
    ink: "#2E2420",
    accent: "#C85A3D",
    label: "pressed at midday",
  },
  late_afternoon: {
    bg: "#FCF5EC",
    ink: "#2F2419",
    accent: "#D2703F",
    label: "pressed in the late afternoon",
  },
  golden_hour: {
    bg: "#FBF3E4",
    ink: "#2E2717",
    accent: "#C9903D",
    label: "pressed at golden hour",
  },
  dusk: {
    bg: "#F8F1F3",
    ink: "#2A2126",
    accent: "#A24E82",
    label: "pressed at dusk",
  },
  blue_hour: {
    bg: "#F4F3F8",
    ink: "#211F2E",
    accent: "#4B4A8F",
    label: "pressed in the blue hour",
  },
  // Inverted blue_hour + dedicated dark_mode flower set (matches design).
  dark_mode: {
    bg: "#211F2E",
    ink: "#F4F3F8",
    accent: "#8C86C9",
    label: "Dark mode, reluctantly. Your eyes, your rules.",
  },
};

export const TAG_COLORS: string[] = DAY_KEYS.map((key) => PALETTES[key].accent);

export interface TimeState {
  timeKey: ThemeKey;
  palette: Palette;
  themeLine: string;
}

export function isDayKey(value: string): value is DayKey {
  return (DAY_KEYS as readonly string[]).includes(value);
}

export function getDayKey(date: Date = new Date()): DayKey {
  const hour = date.getHours();
  for (const range of DAY_RANGES) {
    if (hour >= range.start && hour < range.end) return range.key;
  }
  return "blue_hour";
}

/**
 * Initial theme for a page load:
 * - system dark → dark_mode
 * - otherwise → daylight palette for the current hour
 */
export function resolveInitialThemeKey(options?: {
  prefersDark?: boolean;
  date?: Date;
}): ThemeKey {
  if (options?.prefersDark) return "dark_mode";
  return getDayKey(options?.date);
}

export function toTimeState(timeKey: ThemeKey): TimeState {
  const palette = PALETTES[timeKey];
  return { timeKey, palette, themeLine: palette.label };
}

/**
 * Next theme in the flower cycle.
 * dark_mode is never re-entered here — leaving it jumps to the next daylight
 * slot after the current hour. Dark only returns on a full refresh (boot).
 */
export function nextTimeKey(current: ThemeKey, date: Date = new Date()): DayKey {
  const anchor: DayKey = current === "dark_mode" ? getDayKey(date) : current;
  const i = DAY_KEYS.indexOf(anchor);
  return DAY_KEYS[(i + 1) % DAY_KEYS.length];
}

export function buildThemeVars(timeKey: ThemeKey): Record<string, string> {
  const palette = PALETTES[timeKey];
  const dark = timeKey === "dark_mode";
  const accLg = solveAccent(palette.bg, palette.accent, 3);
  const accSm = solveAccent(palette.bg, palette.accent, 4.5);

  return {
    "--color-bg": palette.bg,
    "--color-text": palette.ink,
    "--color-accent": palette.accent,
    "--acc-lg": accLg,
    "--acc-sm": accSm,
    "--blend": dark ? "normal" : "multiply",
    "--paper-filter": dark ? "invert(0.93)" : "none",
    "--paper-tint": dark ? "0" : "0.9",
    "--btn-ink": dark ? "#211F2E" : "#FFF9EC",
    "--btn-shadow": dark
      ? "none"
      : "0 1px 4px rgba(35,28,15,0.65),0 0 12px rgba(35,28,15,0.5)",
  };
}

/** SSR / hydration default — matches tokens.css first-paint fallback. */
export const DEFAULT_THEME_KEY: ThemeKey = "first_light";

export function isThemeKey(value: string | null | undefined): value is ThemeKey {
  if (!value) return false;
  return value === "dark_mode" || isDayKey(value);
}

export function buildAllThemeVars(): Record<ThemeKey, Record<string, string>> {
  const keys: ThemeKey[] = [...DAY_KEYS, "dark_mode"];
  return keys.reduce(
    (acc, key) => {
      acc[key] = buildThemeVars(key);
      return acc;
    },
    {} as Record<ThemeKey, Record<string, string>>
  );
}

/**
 * Blocking boot script (FOUC prevention). Same idea as next-themes:
 * resolve time-of-day / system dark and paint CSS vars before React hydrates.
 * Hour ranges come from DAY_RANGES so they can't drift from getDayKey().
 */
export function themeInitScriptSource(serializedVars: string): string {
  return `(function(){
  try {
    var vars = ${serializedVars};
    var ranges = ${JSON.stringify(DAY_RANGES)};
    var key = 'blue_hour';
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      key = 'dark_mode';
    } else {
      var hour = new Date().getHours();
      for (var i = 0; i < ranges.length; i++) {
        var r = ranges[i];
        if (hour >= r.start && hour < r.end) { key = r.key; break; }
      }
    }
    var chosen = vars[key] || vars.first_light;
    var root = document.documentElement;
    for (var prop in chosen) {
      if (Object.prototype.hasOwnProperty.call(chosen, prop)) {
        root.style.setProperty(prop, chosen[prop]);
      }
    }
    root.setAttribute('data-time', key);
  } catch (e) {}
})();`;
}
