import { getStore } from "@netlify/blobs";
import {
  MAX_STORED,
  randomStampPosition,
  snapToStampZone,
  type Flower,
  type NewFlowerInput,
} from "./flowers";

const STORE_NAME = "community-canvas";
const KEY = "flowers";
export const MAX_PER_VISITOR = 100; // temp — was 5

declare global {
  // eslint-disable-next-line no-var
  var __pressedMemoryFlowerStore: Flower[] | undefined;
}

function memoryStore(): Flower[] {
  if (!global.__pressedMemoryFlowerStore) {
    global.__pressedMemoryFlowerStore = [];
  }
  return global.__pressedMemoryFlowerStore;
}

function tryGetBlobStore() {
  try {
    return getStore(STORE_NAME);
  } catch {
    return null;
  }
}

async function readAll(): Promise<Flower[]> {
  const store = tryGetBlobStore();
  if (store) {
    try {
      const data = await store.get(KEY, { type: "json" });
      return (data as Flower[]) ?? [];
    } catch {
      return [];
    }
  }
  return memoryStore();
}

async function writeAll(flowers: Flower[]): Promise<void> {
  const store = tryGetBlobStore();
  if (store) {
    try {
      await store.setJSON(KEY, flowers);
      return;
    } catch {
      // fall through
    }
  }
  const mem = memoryStore();
  mem.length = 0;
  mem.push(...flowers);
}

function randomInRange(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

export async function listFlowers(): Promise<Omit<Flower, "visitorToken">[]> {
  const flowers = await readAll();
  return flowers.map(({ visitorToken: _t, location, ...rest }) => ({
    ...rest,
    location: location ?? "",
  }));
}

export class FlowerLimitError extends Error {
  constructor() {
    super("You've reached your daily limit. Come back tomorrow.");
  }
}

export async function addFlower(input: NewFlowerInput): Promise<Flower> {
  const current = await readAll();

  const visitorCount = current.filter((f) => f.visitorToken === input.visitorToken).length;
  if (visitorCount >= MAX_PER_VISITOR) {
    throw new FlowerLimitError();
  }

  const location = (input.location ?? "").trim().slice(0, 48);

  const hasPress =
    typeof input.x === "number" &&
    Number.isFinite(input.x) &&
    typeof input.y === "number" &&
    Number.isFinite(input.y);
  const pos = hasPress
    ? snapToStampZone(input.x as number, input.y as number)
    : randomStampPosition();

  const flower: Flower = {
    id: crypto.randomUUID(),
    shapeId: input.shapeId,
    colorKey: input.colorKey,
    x: pos.x,
    y: pos.y,
    rotation: randomInRange(-15, 15),
    initial: input.initial,
    location,
    createdAt: new Date().toISOString(),
    visitorToken: input.visitorToken,
  };

  // Newest first; oldest fall off past MAX_STORED
  const updated = [flower, ...current].slice(0, MAX_STORED);
  await writeAll(updated);
  return flower;
}
