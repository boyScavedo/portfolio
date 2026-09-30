import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.ADMIN_SECRET ?? "change-me";
const TOKEN_TTL_MS = 60 * 60 * 24 * 7 * 1000; // 7 days, matches cookie maxAge

export function signToken(value: string): string {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${value}:${exp}`;
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyToken(token: string): boolean {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);

  const expected = createHmac("sha256", SECRET).update(payload).digest("hex");

  // Timing-safe comparison — prevents byte-by-byte HMAC leakage
  try {
    const sigBuf = Buffer.from(sig, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) return false;
    if (!timingSafeEqual(sigBuf, expBuf)) return false;
  } catch {
    return false;
  }

  // Check embedded expiry
  const parts = payload.split(":");
  const exp = parseInt(parts[parts.length - 1], 10);
  if (isNaN(exp) || Date.now() > exp) return false;

  return true;
}

export async function isAdmin(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  const token = jar.get("admin_token")?.value;
  if (!token) return false;
  return verifyToken(token);
}

/**
 * Check an incoming `Authorization: Bearer <key>` against RADAR_API_KEY.
 *
 * Separate from the admin cookie on purpose: this is a machine-to-machine
 * credential held only by the radar runner, and reusing the browser token would
 * mean a leaked dashboard session could post digests.
 *
 * Fails closed if RADAR_API_KEY is unset, so a missing env var blocks posting
 * rather than opening the endpoint to anyone.
 */
export function verifyRadarKey(header: string | null): boolean {
  const expected = process.env.RADAR_API_KEY;
  if (!expected) {
    console.error("[radar] RADAR_API_KEY is not set — rejecting request");
    return false;
  }
  if (!header?.startsWith("Bearer ")) return false;

  const provided = header.slice("Bearer ".length);
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  // timingSafeEqual throws on length mismatch, so compare lengths first.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
