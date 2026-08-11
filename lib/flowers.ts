import type { DayKey, ThemeKey } from "./theme";
import { DAY_KEYS } from "./theme";

/** Flower art: /public/flowers/{timeKey}/{timeKey}_{suffix}. Shared: /public/flowers/neutral/. */
export function assetPath(timeKey: ThemeKey, suffix: string): string {
  return `/flowers/${timeKey}/${timeKey}_${suffix}`;
}

export function neutralAsset(suffix: string): string {
  return `/flowers/neutral/${suffix}`;
}

export const FLOWER_SUFFIXES = {
  heroCluster: "flower_hero_cluster.png",
  stampShape01: "flower_stamp_shape_01.png",
  stampShape02: "flower_stamp_shape_02.png",
  master: "master.png",
  favicon: "flower_icon_favicon.png",
  wilted: "flower_404_wilted.png",
  buttonCropped: "flower_button_cropped.png",
} as const;

export function flowerAssets(timeKey: ThemeKey) {
  return {
    hero: assetPath(timeKey, FLOWER_SUFFIXES.heroCluster),
    stamp1: assetPath(timeKey, FLOWER_SUFFIXES.stampShape01),
    stamp2: assetPath(timeKey, FLOWER_SUFFIXES.stampShape02),
    master: assetPath(timeKey, FLOWER_SUFFIXES.master),
    favicon: assetPath(timeKey, FLOWER_SUFFIXES.favicon),
    wilted: assetPath(timeKey, FLOWER_SUFFIXES.wilted),
    button: assetPath(timeKey, FLOWER_SUFFIXES.buttonCropped),
  };
}

export const NEUTRAL_ASSETS = {
  postcardPaper: neutralAsset("canvas.png"),
  paper1: neutralAsset("paper-1.png"),
  paper2: neutralAsset("paper-2.png"),
  paper3: neutralAsset("paper-3.png"),
  aboutPhoto: neutralAsset("donia_photo.png"),
};

export type ShapeId = "shape_01" | "shape_02";
/** Petal colors are daylight palettes only (dark mode is not a stamp color). */
export type ColorKey = DayKey;

export const SHAPE_IDS: ShapeId[] = ["shape_01", "shape_02"];
export const COLOR_KEYS: ColorKey[] = DAY_KEYS;

export interface Flower {
  id: string;
  shapeId: ShapeId;
  colorKey: ColorKey;
  x: number;
  y: number;
  rotation: number;
  initial: string;
  /** Approximate place the press came from, e.g. "Toronto". */
  location?: string;
  createdAt: string;
  visitorToken: string;
}

export interface NewFlowerInput {
  shapeId: ShapeId;
  colorKey: ColorKey;
  initial: string;
  location?: string;
  visitorToken: string;
  /** Optional press position as % of the contact surface (0–100). */
  x?: number;
  y?: number;
}

/** Turn an IANA timezone like America/Toronto into a short place label. */
export function locationFromTimezone(timezone: string): string {
  const raw = timezone.trim();
  if (!raw) return "";
  const leaf = raw.split("/").pop() ?? raw;
  return leaf.replace(/_/g, " ");
}

export const INITIAL_PATTERN = /^[A-Za-z0-9]{0,2}$/;

/** Newest flowers kept in storage / shown on desktop. */
export const MAX_STORED = 200;
/** Cap rendered floor flowers on small viewports. */
export const MAX_VISIBLE_MOBILE = 10;

/**
 * Desktop stamps may sit in the side gutters (including beside the title) or
 * along the bottom — never behind the centered title / postcard column.
 * Values are percentages of the contact surface.
 */
export function isStampSafeZone(x: number, y: number): boolean {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
  if (y < 6 || y > 98) return false;
  const left = x <= 22;
  const right = x >= 78;
  const bottom = y >= 70;
  // Sides are fine at any height (including near the title); center only at bottom.
  return left || right || bottom;
}

export function snapToStampZone(x: number, y: number, salt = 0): { x: number; y: number } {
  const clampedX = Math.min(98, Math.max(2, x));
  const clampedY = Math.min(96, Math.max(8, y));
  if (isStampSafeZone(clampedX, clampedY)) {
    return { x: roundPos(clampedX), y: roundPos(clampedY) };
  }

  // Center / title presses: slide to the nearer side and keep the height,
  // so stamps can sit beside the title without covering it.
  const distLeft = Math.abs(clampedX - 12);
  const distRight = Math.abs(clampedX - 88);
  const distBottom = Math.abs(clampedY - 82);
  const pick = salt % 3;

  if (distBottom < distLeft && distBottom < distRight && clampedY >= 55) {
    return { x: roundPos(clampedX), y: roundPos(Math.max(72, clampedY)) };
  }
  if (distLeft < distRight || pick === 0) {
    return { x: roundPos(Math.min(18, clampedX)), y: roundPos(clampedY) };
  }
  return { x: roundPos(Math.max(82, clampedX)), y: roundPos(clampedY) };
}

export function randomStampPosition(salt = Math.random()): { x: number; y: number } {
  const zone = Math.floor(salt * 3) % 3;
  if (zone === 0) {
    // Left gutter — can sit up beside the title
    return { x: roundPos(3 + salt * 16), y: roundPos(10 + ((salt * 97) % 82)) };
  }
  if (zone === 1) {
    // Right gutter — can sit up beside the title
    return { x: roundPos(82 + salt * 15), y: roundPos(10 + ((salt * 53) % 82)) };
  }
  // Bottom band
  return { x: roundPos(10 + ((salt * 71) % 80)), y: roundPos(72 + ((salt * 29) % 22)) };
}

function roundPos(n: number): number {
  return Math.round(n * 100) / 100;
}

export function stampSrc(colorKey: ColorKey, shapeId: ShapeId): string {
  const assets = flowerAssets(colorKey);
  return shapeId === "shape_01" ? assets.stamp1 : assets.stamp2;
}

export async function fetchFlowers(): Promise<Flower[]> {
  const res = await fetch("/api/flowers", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load flowers");
  const data = await res.json();
  return data.flowers as Flower[];
}

export async function postFlower(input: NewFlowerInput): Promise<Flower> {
  const timezone =
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "";
  const res = await fetch("/api/flowers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, timezone }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to leave a flower");
  }
  const data = await res.json();
  return data.flower as Flower;
}
