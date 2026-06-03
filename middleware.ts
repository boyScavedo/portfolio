import { NextRequest, NextResponse } from "next/server";

async function verifyAdminToken(token: string): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET ?? "change-me";
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [value, sig] = parts;

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
  const data = new TextEncoder().encode(value);

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
