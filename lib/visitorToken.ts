const STORAGE_KEY = "pressed.visitorToken";

function randomToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/** Lazily creates and persists a per-browser token used for community-canvas rate limiting. */
export function getVisitorToken(): string {
  if (typeof window === "undefined") return "server";
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const token = randomToken();
    window.localStorage.setItem(STORAGE_KEY, token);
    return token;
  } catch {
    return randomToken();
  }
}
