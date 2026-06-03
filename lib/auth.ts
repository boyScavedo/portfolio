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
