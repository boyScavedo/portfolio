import { NextRequest, NextResponse } from "next/server";

async function verifyAdminToken(token: string): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET ?? "change-me";

  // Token format: "admin:EXPIRY.HEXSIG" — split on last dot
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);

  // Check expiry embedded in payload ("admin:TIMESTAMP")
  const colonIdx = payload.lastIndexOf(":");
  if (colonIdx === -1) return false;
  const exp = parseInt(payload.slice(colonIdx + 1), 10);
  if (isNaN(exp) || Date.now() > exp) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const sigBytes = Uint8Array.from(
    sig.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) ?? []
  );
  const data = new TextEncoder().encode(payload);

  return crypto.subtle.verify("HMAC", key, sigBytes, data);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("admin_token")?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
