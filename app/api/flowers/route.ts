import { NextResponse } from "next/server";
import {
  COLOR_KEYS,
  INITIAL_PATTERN,
  SHAPE_IDS,
  locationFromTimezone,
} from "@/lib/flowers";
import { addFlower, FlowerLimitError, listFlowers } from "@/lib/flowerStore";

export const dynamic = "force-dynamic";

function locationFromHeaders(request: Request): string {
  const city =
    request.headers.get("x-nf-city") ||
    request.headers.get("x-vercel-ip-city") ||
    request.headers.get("cf-ipcity");
  if (city) {
    try {
      return decodeURIComponent(city).replace(/\+/g, " ").slice(0, 48);
    } catch {
      return city.slice(0, 48);
    }
  }
  return "";
}

export async function GET() {
  const flowers = await listFlowers();
  return NextResponse.json({ flowers });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { shapeId, colorKey, initial, visitorToken, timezone, x, y } = body as Record<
    string,
    unknown
  >;

  if (typeof shapeId !== "string" || !SHAPE_IDS.includes(shapeId as never)) {
    return NextResponse.json({ error: "Invalid petal shape." }, { status: 400 });
  }
  if (typeof colorKey !== "string" || !COLOR_KEYS.includes(colorKey as never)) {
    return NextResponse.json({ error: "Invalid color." }, { status: 400 });
  }
  if (typeof initial !== "string" || !INITIAL_PATTERN.test(initial)) {
    return NextResponse.json(
      { error: "Initial must be up to 2 letters or numbers." },
      { status: 400 }
    );
  }
  if (typeof visitorToken !== "string" || visitorToken.length < 4 || visitorToken.length > 128) {
    return NextResponse.json({ error: "Missing visitor token." }, { status: 400 });
  }

  const pressX = typeof x === "number" && Number.isFinite(x) ? x : undefined;
  const pressY = typeof y === "number" && Number.isFinite(y) ? y : undefined;

  const fromHeaders = locationFromHeaders(request);
  const fromTimezone =
    typeof timezone === "string" ? locationFromTimezone(timezone.slice(0, 64)) : "";
  const location = fromHeaders || fromTimezone;

  try {
    const flower = await addFlower({
      shapeId: shapeId as never,
      colorKey: colorKey as never,
      initial,
      location,
      visitorToken,
      x: pressX,
      y: pressY,
    });
    return NextResponse.json({ flower }, { status: 201 });
  } catch (err) {
    if (err instanceof FlowerLimitError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Something wilted. Try again." }, { status: 500 });
  }
}
