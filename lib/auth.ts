import { createHmac } from "crypto";

const SECRET = process.env.ADMIN_SECRET ?? "change-me";

export function signToken(value: string): string {
  const sig = createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${sig}`;
}

export function verifyToken(token: string): boolean {
  const [value, sig] = token.split(".");
  if (!value || !sig) return false;
  const expected = createHmac("sha256", SECRET).update(value).digest("hex");
  return sig === expected;
}

export async function isAdmin(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  const token = jar.get("admin_token")?.value;
  if (!token) return false;
  return verifyToken(token);
}
